import { readdir, readFile, writeFile, stat } from 'node:fs/promises';
import { cwd } from 'node:process';
import * as path from 'node:path';
import { canonicalServiceUrl } from '@iiif/parser/image-3';
import { Traverse } from '@iiif/parser';

(async function main() {
    const pkg = await import('@iiif/parser/upgrader');
    const { upgrade } = pkg.default;

    const manifestIndex = {};
    const canvasIndex = {};
    const imageServiceIndex = {};

    const objects = await readdir(path.join(cwd(), 'content', 'objects'));
    const exhibitions = await readdir(path.join(cwd(), 'content', 'exhibitions'));
    const manifests = [];

    for (const object of objects) {
        manifests.push(path.join(cwd(), 'content', 'objects', object));
    }


    const collections = await readdir(path.join(cwd(), 'content', 'collections'));

    async function processLevel(root, dirname) {
        const newRoot = path.join(root, dirname);
        const collections = await readdir(newRoot);
        for (const collection of collections) {
            const col = await stat(path.join(newRoot, collection));
            if (col.isDirectory()) {
                await processLevel(newRoot, collection);
            } else if (col.isFile()) {
                manifests.push(path.join(newRoot, collection));
            }
        }
    }

    await processLevel(path.join(cwd(), 'content'), 'collections');

    const promises = [];

    for (const object of manifests) {

        const uuid = path.basename(object, '.json');

        promises.push((async () => {
            const fileContents = await readFile(object);
            const manifest = upgrade(JSON.parse(fileContents.toString()));
            if (manifest.type === 'Collection') {
                // Skip collections.. obviously.
                return;
            }

            if (!manifest || !manifest.items) {
                console.log('error', object);
                return;
            }

            manifestIndex[manifest.id] = uuid;

            for (const canvas of manifest.items) {
                canvasIndex[canvas.id] = uuid;

                if (!canvas.items) {
                    console.log('error', object, canvas.id);
                    continue;
                }

                const page = canvas.items[0];
                if (page) {

                    for (const annotation of page.items) {
                        const bodies = Array.isArray(annotation.body) ? annotation.body : [annotation.body];
                        for (let body of bodies) {
                            if (annotation.body.type === "SpecificResource") {
                                body = annotation.body.source;
                            }

                            const services = body.service ? Array.isArray(body.service) ? body.service : [body.service] : [];

                            for (const service of services) {
                                const id = service.id || service['@id'];
                                imageServiceIndex[canonicalServiceUrl(id)] = {id: uuid, index: manifest.items.indexOf(canvas)};
                            }
                        }
                    }
                }
            }
        })());
    }

    function extractManifestImageServices(manifest) {
        const mapping = {};
        const traverseAnnotation = (anno) => {
            if (!anno.body) {
                return anno;
            }
            const body = Array.isArray(anno.body) ? anno.body : [anno.body];
            for (const item of body || []) {
                if (item.service) {
                    const singleBody =
                        item.type === 'SpecificResource' ? item.source : item;


                    const services = Array.isArray(singleBody.service)
                        ? singleBody.service
                        : [singleBody.service];

                    for (const service of services) {
                        const id = service.id || service['@id'];
                        if (id) {
                            const realId = canonicalServiceUrl(id);
                            if (imageServiceIndex[realId]) {
                                mapping[anno.id] = mapping[anno.id] || [];
                                mapping[anno.id].push({
                                    object: imageServiceIndex[realId].id,
                                    objectIndex: imageServiceIndex[realId].index,
                                });
                            }
                        }
                    }
                }
            }

            return anno;
        };

        const traverse = new Traverse({
            annotation: [traverseAnnotation],
        });

        traverse.traverseManifest(manifest);

        return mapping;
    }

    await Promise.all(promises);

    const exhibitionIndex = {};

    for (const exhibition of exhibitions) {
        const name = path.basename(exhibition, '.json');
        const fileContents = await readFile(path.join(cwd(), 'content', 'exhibitions', exhibition));
        const manifest = JSON.parse(fileContents.toString());
        exhibitionIndex[`exhibitions/${name}`] = extractManifestImageServices(manifest);
    }


    const finalData = JSON.stringify({
        manifestIndex,
        canvasIndex,
        imageServiceIndex,
        exhibitionIndex,
    }, null, 2);


    await writeFile(path.join(cwd(), '.build-cache', `object-index.json`), finalData);


})();


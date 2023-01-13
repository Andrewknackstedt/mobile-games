import { NgtRenderState, NgtVector3 } from '@angular-three/core';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { ExtrudeGeometry, Group, Mesh, MeshNormalMaterial } from 'three';
import { NgtMesh, } from '@angular-three/core/meshes';
import { NgtBoxGeometry, NgtExtrudeGeometry } from '@angular-three/core/geometries';
import { NgtMeshStandardMaterial } from '@angular-three/core/materials';
import { Fetch } from 'src/app/services/fetch.service';
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";
import { CommonModule } from '@angular/common';


@Component({
    selector: 'app-level',
    templateUrl: './level.component.html',
    styleUrls: ['./level.component.scss'],
    imports: [
        CommonModule,
        NgtMesh,
        NgtBoxGeometry,
        NgtMeshStandardMaterial,
        NgtExtrudeGeometry
    ],
    standalone: true,
    // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LevelComponent {

    @Input() position?: NgtVector3;

    constructor(private fetch: Fetch) {
        this.loadLevel();
    }

    meshes = [];

    async loadLevel() {
        const svg = await this.fetch.get<string>("/assets/levels/pixel-crusher/level-base.svg");
        const loader = new SVGLoader();
        const svgData = loader.parse(svg);

        console.log(svg);

        // Group that will contain all of our paths
        const svgGroup = new Group();

        const material = new MeshNormalMaterial();

        // Loop through all of the parsed paths
        svgData.paths.forEach((path, i) => {
            const shapes = path.toShapes(true);

            // Each path has array of shapes
            shapes.forEach((shape, j) => {

                // Finally we can take each shape and extrude it
                const geometry = new ExtrudeGeometry(shape, {
                    depth: 2,
                    bevelEnabled: true
                });

                this.meshes.push(geometry);

                // // Create a mesh and add it to the group
                // const mesh = new Mesh(geometry, material);

                // svgGroup.add(mesh);

                // console.log(mesh);
            });
        });
        // svgGroup. = 0.01;
        // svgGroup.scale.x = .1;
        // svgGroup.scale.y = .1;

        // svgGroup.rotateZ(Math.PI);

        // Add our group to the scene (you'll need to create a scene)
        // this.scene.add(svgGroup);
        // this.mesh = svgGroup;


        // const box = new BoxGeometry(2,2,2);
        // const mesh = new Mesh(box, material);
        // this.scene.add(mesh);
    }


}

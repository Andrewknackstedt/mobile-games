import { NgtCanvas, NgtState } from '@angular-three/core';
import { Component, OnInit } from '@angular/core';
import { AlienComponent } from './alien/alien.component';
import { NgtAmbientLight, NgtSpotLight, NgtPointLight } from '@angular-three/core/lights';
import { NgtSobaOrbitControls } from '@angular-three/soba/controls';
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";
import { BoxGeometry, ExtrudeGeometry, Group, Mesh, MeshNormalMaterial, Scene, Vector3 } from 'three';
import { Fetch } from '../../services/fetch.service';
import { LevelComponent } from './level/level.component';

@Component({
  selector: 'app-alien-consume',
  templateUrl: './alien-consume.component.html',
  styleUrls: ['./alien-consume.component.scss'],
  imports: [
    NgtCanvas,
    NgtAmbientLight,
    NgtSpotLight,
    NgtPointLight,
    NgtSobaOrbitControls,
    AlienComponent,
    LevelComponent
  ],
  standalone: true
})
export class AlienConsumeComponent implements OnInit {

    scene: Scene;

    constructor(private fetch: Fetch) { }

    ngOnInit() {
        // this.loadLevel();
    }

    onCreated(evt: NgtState) {
        this.scene = evt.scene;
        // this.loadLevel();

    }

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

                // Create a mesh and add it to the group
                const mesh = new Mesh(geometry, material);

                svgGroup.add(mesh);

                console.log(mesh);
            });
        });
        // svgGroup. = 0.01;
        svgGroup.scale.x = .1;
        svgGroup.scale.y = .1;

        svgGroup.rotateZ(Math.PI)

        // Add our group to the scene (you'll need to create a scene)
        this.scene.add(svgGroup);


        // const box = new BoxGeometry(2,2,2);
        // const mesh = new Mesh(box, material);
        // this.scene.add(mesh);
    }

}

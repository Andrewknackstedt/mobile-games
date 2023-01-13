import { NgtRenderState, NgtVector3 } from '@angular-three/core';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Mesh } from 'three';
import { NgtMesh, } from '@angular-three/core/meshes';
import { NgtBoxGeometry } from '@angular-three/core/geometries';
import { NgtMeshStandardMaterial } from '@angular-three/core/materials';

@Component({
    selector: 'app-alien',
    templateUrl: './alien.component.html',
    styleUrls: ['./alien.component.scss'],
    imports: [
        NgtMesh,
        NgtBoxGeometry,
        NgtMeshStandardMaterial
    ],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlienComponent {

    @Input() position?: NgtVector3;

    hovered = false;
    active = false;

    onCubeBeforeRender($event: { state: NgtRenderState; object: Mesh; }) {
        const cube = $event.object;
        cube.rotation.x += 0.01;
    }
}

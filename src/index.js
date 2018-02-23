import React from 'react';
import ReactDOM from 'react-dom';
import * as THREE from "three";

require('./js/NRRDLoader');

class Scene extends React.Component {
    constructor(props) {
        super(props)

        this.start = this.start.bind(this)
        this.stop = this.stop.bind(this)
        this.animate = this.animate.bind(this)
    }

    componentDidMount() {
        const width = this.mount.clientWidth
        const height = this.mount.clientHeight

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(
            75,
            width / height,
            0.1,
            1000
        )

        var loader = new THREE.NRRDLoader();
        loader.load("models/columnasegmentado01.nrrd", function (volume) {
            var sliceZ;


            //z plane

            var indexZ = 0;
            sliceZ = volume.extractSlice('z', Math.floor(volume.RASDimensions[2] / 4));
            scene.add(sliceZ.mesh);

        });

        const renderer = new THREE.WebGLRenderer({antialias: true})


        camera.position.z = 4
        renderer.setClearColor('#000000')
        renderer.setSize(width, height)

        this.scene = scene
        this.camera = camera
        this.renderer = renderer

        this.mount.appendChild(this.renderer.domElement)
        this.start()
    }

    componentWillUnmount() {
        this.stop()
        this.mount.removeChild(this.renderer.domElement)
    }

    start() {
        if (!this.frameId) {
            this.frameId = requestAnimationFrame(this.animate)
        }
    }

    stop() {
        cancelAnimationFrame(this.frameId)
    }

    animate() {


        this.renderScene()
        this.frameId = window.requestAnimationFrame(this.animate)
    }

    renderScene() {
        this.renderer.render(this.scene, this.camera)
    }

    render() {
        return (
            <div
                style={{width: '400px', height: '400px'}}
                ref={(mount) => {
                    this.mount = mount
                }}
            />
        )
    }
}

ReactDOM.render(<Scene/>, document.getElementById('root'))

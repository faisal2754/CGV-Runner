function createMaterial() {
    const textureLoader = new THREE.TextureLoader()

    const material = [
        new THREE.MeshBasicMaterial({
            map: textureLoader.load('assets/skybox/corona_ft.png'),
            side: THREE.DoubleSide
        }), //front side
        new THREE.MeshBasicMaterial({
            map: textureLoader.load('assets/skybox/corona_bk.png'),
            side: THREE.DoubleSide
        }), //back side
        new THREE.MeshBasicMaterial({
            map: textureLoader.load('assets/skybox/corona_up.png'),
            side: THREE.DoubleSide
        }), //up side
        new THREE.MeshBasicMaterial({
            map: textureLoader.load('assets/skybox/corona_dn.png'),
            side: THREE.DoubleSide
        }), //down side
        new THREE.MeshBasicMaterial({
            map: textureLoader.load('assets/skybox/corona_rt.png'),
            side: THREE.DoubleSide
        }), //right side
        new THREE.MeshBasicMaterial({
            map: textureLoader.load('assets/skybox/corona_lf.png'),
            side: THREE.DoubleSide
        }) //left side
    ]

    return material
}

function createSkybox() {
    const geometry = new THREE.BoxBufferGeometry(1000, 1000, 1000)
    const material = createMaterial()
    const skybox = new THREE.Mesh(geometry, material)
    skybox.rotation.set(-0.5, -0.1, 0.8)

    return skybox
}

export { createSkybox }

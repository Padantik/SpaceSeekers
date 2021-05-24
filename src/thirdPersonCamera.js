class ThirdPersonCamera {
    constructor(params) {
        this.params = params;
        this.camera = params.camera

        this.currentPosition = new THREE.Vector3();
        this.currentLookat = new THREE.Vector3();
    }
}
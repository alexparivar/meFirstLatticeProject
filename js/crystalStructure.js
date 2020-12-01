import * as THREE from './three.module.js';

function crystalStructure() {
    const canvas = document.querySelector('#lattice');
    const renderer = new THREE.WebGLRenderer({canvas});

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x999999);

    let light1color = 0xFFFFFF;
    let light1inten = 1;
    let light1pos = (10,2,4);
    let light2color = 0xFFFFFF;
    let light2inten = 1;
    let light2pos = (!light1pos);
    setLighting(light1color, light1inten, light1pos)
    setLighting(light2color, light2inten, light2pos)
    
    //Enumate crystal systems
    const crystalSystems = {
        TRICLINIC: 'triclinic',
        MONOCLINIC: 'monoclinic',
        ORTHORHOMBIC: 'orthorhombic',
        TETRAGONAL: [ 'tetragonal', 'trigonal' ],
        RHOMBOHEDRAL: 'rhombohedral',
        HEXAGONAL: 'hexagonal',
        CUBIC: 'cubic'
    }

    //Pass:
    //crystal system: CHTROMT
    //bravais type: (P,F,I,R): Primitive, Face-centered, Body-centered, Base-centered: A,B,C
    //dimension: 3D (crystal structure)
    //pass angles (?)
    //pass lattice parameters (?)
    function meCrystalStructure(crystalSystem) {
        switch (crystalSystem) {
            case crystalSystem.TRICLINIC:
                latticeParams = [1,2,3];
                latticeAngles = [10, 20, 30];
                break;
            case crystalSystem.MONOCLINIC:
                latticeParams = [1,2,3];
                latticeAngles = [10,10,20];
                break;
            case crystalSystem.ORTHORHOMBIC:
                latticeParams = [1,1,2];
                latticeAngles = [90,90,90];
                break;
            case crystalSystem.TETRAGONAL:
                latticeParams = [];
                latticeAngles = [];
                break;
            case crystalSystem.RHOMBOHEDRAL:
                latticeParams = [];
                latticeAngles = [];
                break;
            case crystalSystem.HEXAGONAL:
                latticeParams = [];
                latticeAngles = [];
                break;
            case crystalSystem.CUBIC:
                latticeParams = [];
                latticeAngles = [];
                break;
            default:
                throw new Error('Invalid crystal system');
        }
    }

    {
        //const width = 8;
        //const height = 8;
        //const depth = 8;
        //addSolidGeometry(-2, -2, new THREE.BoxBufferGeometry(width,height,depth));
    }

    let meCubicCrystal = new cubicStructure();
    console.log(meCubicCrystal.latticeParams);
    
    let fov = 70;
    let aspect = 2;
    let near = 0.1;
    let far = 1000;
    let camera = new THREE.PerspectiveCamera();
    setCamera(fov, aspect, near, far);
    let scenePosition = (0,0,0);
    
    let objects = [];
    let atoms = [];
    let atomSpread = 1;
    let spread = 1;
    setCameraPosition(camera, 0, 0, 2);
    setCameraLook(camera, scenePosition);
    //const material = [ 
    //    new THREE.LineBasicMaterial({ color: 0x3f9e45 }), 
    //    new THREE.LineBasicMaterial({ color: 0x823355 }),
    //    new THREE.LineBasicMaterial({ color: 0x603382 }) 
    //];
    const lineColorMaterial = [ 
        new THREE.LineBasicMaterial({ color: 'black' }), 
        new THREE.LineBasicMaterial({ color: 'orange' }),
        new THREE.LineBasicMaterial({ color: 'black' }) 
    ];

    const atomColorMaterial = [
        new THREE.MeshBasicMaterial({ color: 0x304082 }), 
        new THREE.MeshBasicMaterial({ color: 0x304082 }),
        new THREE.MeshBasicMaterial({ color: 0x304082 })
    ];

    let dimX = 30;
    let dimY = 30;
    let dimZ = 1;
    let i, j, k;
    let o = 0;
    for (i = -dimX; i < (dimX + 1); i++) {
        for (j = -dimY; j < (dimY + 1); j++) { 
            for (k = -dimZ; k < (dimZ + 1); k++) {
                makeUnitCell(i,j,k, lineColorMaterial[o]);
                makeAtom(i,j,k, atomColorMaterial[o]);
                o++
                if (o == 3) { o = 0; }
            }
        }
    }
        

    //////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////
    //Functions here//////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////

    //Hard code crystal structure
    function cubicStructure () {
        this.latticeParams = [[1,0,0],[0,1,0],[0,0,1]];
        this.latticeAngles = [90,90,90];
    }

    function makeUnitCell (x, y, z, material) {
        const points = [];
        //points.push(new THREE.Vector3(args.latticeParams[0][1]));
        points.push( new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 0, 0));
        points.push( new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1, 0));
        points.push( new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 1));
        const geometry = new THREE.BufferGeometry().setFromPoints( points );
        //console.log(material.color);
        const line = new THREE.Line( geometry, material );
        addObject(x,y,z,line);
    }

    function makeAtom (x,y,z,material) {
        const hue = Math.random(); //0 to 1. 0 red, 0.33 green, 0.66 blue.
        const saturation = 1; //0 to 1. 0 no color, 1 saturated.
        const luminance = 0.5; //0 to 1. 0 black, 1 white, 0.5 max color
        material.color.setHSL(hue,saturation,luminance);
        const geometry = new THREE.SphereGeometry( 0.1, 6, 6 );
        //const material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
        const sphere = new THREE.Mesh( geometry, material );
        addAtom(x,y,z,sphere);
    }

    function setCameraLook() {
        camera.lookAt(0,0,0);
    }

    function setCameraPosition(camera, x, y, z) {
        camera.position.x = x;
        camera.position.y = y;
        camera.position.z = z;
    }

    function setCamera(fov, aspect, near, far) {
        camera.fov = fov;
        camera.aspect = aspect;
        camera.near = near;
        camera.far = far;
    }

    function setLighting(color, intensity, position) {
        let light = new THREE.DirectionalLight(color, intensity);
        light.position.set(position);
        scene.add(light);
    }

    function addSolidGeometry(x, y, geometry) {
        const material = new THREE.LineBasicMaterial({color: 0x000000});
        const mesh = new THREE.LineSegments(geometry, material);
        addObject(x, y, mesh);
    }

    function addLineGeometry(x, y, geometry) {
        const material = new THREE.LineBasicMaterial({color: 0x000000});
        const mesh = new THREE.LineSegments(geometry, material);
        addObject(x, y, mesh);
    }

    function createMaterial() {
        const material = new THREE.MeshPhongMaterial({
            side: THREE.DoubleSide, //Draw both triangle sides. 2D.
        });
        const hue = Math.random(); //0 to 1. 0 red, 0.33 green, 0.66 blue.
        const saturation = 1; //0 to 1. 0 no color, 1 saturated.
        const luminance = 0.5; //0 to 1. 0 black, 1 white, 0.5 max color
        material.color.setHSL(hue,saturation,luminance);
        return material;
    }

    function addObject(x,y,z,obj) { //Object3D
        obj.position.x = x * spread; //X
        obj.position.y = y * spread; //Y
        obj.position.z = z * spread; //Z
        scene.add(obj); //SCENE
        objects.push(obj); //ARRAY
    }

    function addAtom(x,y,z,obj) { //Object3D
        obj.position.x = x * atomSpread; //X
        obj.position.y = y * atomSpread; //Y
        obj.position.z = z * atomSpread; //Z
        scene.add(obj); //SCENE
        atoms.push(obj); //ARRAY
    }

    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }

    function render(time) {
        time *= 0.001;
        if(resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }
        //SPEED and ROTATION
        objects.forEach((obj, ndx) => {
            //const speed = 5.1 + ndx * 0.05;
            const speed = 2.1
            const rot = time * speed;
            //obj.rotation.x = rot;
            //obj.rotation.y = rot;
            //obj.rotation.z = rot;
        });
        atoms.forEach((obj, ndx) => {
            //const speed = 5.1 + ndx * 0.05;
            const speed = 2.1
            const rot = time * speed;
            //obj.rotation.x = rot;
            //obj.rotation.y = rot;
            //obj.rotation.z = rot;
        });
        camera.position.x = Math.cos(time/10) * 20;
        camera.position.y = Math.sin(time/10) * 20-20;
        camera.position.z = 3;
        //camera.position.z = Math.sin(time) * 15 + 30;
        //camera.lookAt(Math.cos(time/5)*20,Math.sin(time/5)*15 + 20,5);
        camera.lookAt(Math.cos(time/10)*19,Math.sin(time/10)*19,0);
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

crystalStructure();


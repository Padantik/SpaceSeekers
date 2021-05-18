import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import $, { grep } from 'jquery';

    //Favicon Load      
        const favicon = document.getElementById('favicon');
        favicon.href = "Favicon/favicon-32x32.png"

    //Loading Screen
    $(window).on('load', () => {
        setTimeout(removeLoader, 2500);
    });

    const removeLoader = () => {
        $( "#loading-screen" ).fadeOut(1000, () => {
            $( "#loading-screen" ).remove();
        });  
    }

    // Debug
        //const gui = new dat.GUI()

    // Canvas
        const canvas = document.querySelector('canvas.webgl');


    //Scene
        const scene = new THREE.Scene();


    //Sizing
        const sizes = {
            width: window.innerWidth,
            height: window.innerHeight
        }

        window.addEventListener('resize', () => {
            // Update sizes
            sizes.width = window.innerWidth
            sizes.height = window.innerHeight

            // Update camera
            camera.aspect = sizes.width / sizes.height
            camera.updateProjectionMatrix()

            // Update renderer
            renderer.setSize(sizes.width, sizes.height)
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        })
    
    //Renderer
        const renderer = new THREE.WebGLRenderer({
            canvas:canvas,
            alpha: true,
        })
        renderer.setSize(sizes.width, sizes.height)


    //Camera
        const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height, 0.1, 110000);
        camera.position.x = 0
        camera.position.y = 200
        camera.position.z = 2700
        const cameraPole = new THREE.Object3D();
        scene.add(cameraPole);
        cameraPole.rotation.y = -300
        cameraPole.add(camera);


    // Controls
        const controls = new OrbitControls(camera, canvas)
        controls.maxDistance = 55000
        

    //Star Generation
        const stars = new THREE.Points(
            new THREE.BufferGeometry(),
            new THREE.PointsMaterial({
                color: 0xffffff
            })
        )

        const starPosition = [];
        for(let star = 0; star < 1000; star++) {
            const x = (Math.random() - 0.5) * 100000;
            const y = (Math.random() - 0.5) * 100000;
            const z = (Math.random() - 0.5) * 100000;
            starPosition.push(x, y, z)
        }  
         
        stars.geometry.setAttribute('position', new THREE.Float32BufferAttribute(starPosition, 3))
        scene.add(stars)
  
    
    // SunLight
        const SunLight = new THREE.PointLight(0xffffff, 0.5)
        SunLight.position.set(0,0,0)   
        SunLight.intensity = 1.7
        scene.add(SunLight)



    //Entities
        const spacialEntities = [];
        const SoyMilkyWay = new THREE.Object3D();
        scene.add(SoyMilkyWay);

        //For Reference
            //Radius of each Planet & Sun
                const radiusOfEntities = {
                    sun: 696.340,
                    mercury: 2.4397,
                    venus: 6.0518,
                    earth: 6.371,
                    mars: 3.3895,
                    jupiter: 69.911,
                    saturn: 58.232,
                    uranus: 25.362,
                    neptune: 24.622
                }
            //Distance from the sun value
                const distanceFromSun = {
                    mercury: radiusOfEntities.sun + 579,
                    venus: radiusOfEntities.sun + 1082,
                    earth: radiusOfEntities.sun + 1496,
                    mars: radiusOfEntities.sun + 2279,
                    jupiter: radiusOfEntities.sun + 7786,
                    saturn: radiusOfEntities.sun + 14335,
                    uranus: radiusOfEntities.sun + 28725,
                    neptune: radiusOfEntities.sun + 44951
                }    
                
            //Orbit Line Path Value
                const planetaryOrbitalPath = {                           
                    mercury : new THREE.EllipseCurve(
                        0, 0,          
                        distanceFromSun.mercury, distanceFromSun.mercury,          
                        0,  2 * Math.PI,
                        false,            
                        0          
                    ),                         
                    venus : new THREE.EllipseCurve(
                        0, 0,          
                        distanceFromSun.venus, distanceFromSun.venus,          
                        0,  2 * Math.PI,
                        false,            
                        0          
                    ),                         
                    earth : new THREE.EllipseCurve(
                        0, 0,          
                        distanceFromSun.earth, distanceFromSun.earth,          
                        0,  2 * Math.PI,
                        false,            
                        0          
                    ),                         
                    mars : new THREE.EllipseCurve(
                        0, 0,          
                        distanceFromSun.mars, distanceFromSun.mars,          
                        0,  2 * Math.PI,
                        false,            
                        0          
                    ),                         
                    jupiter : new THREE.EllipseCurve(
                        0, 0,          
                        distanceFromSun.jupiter, distanceFromSun.jupiter,          
                        0,  2 * Math.PI,
                        false,            
                        0          
                    ),                         
                    saturn : new THREE.EllipseCurve(
                        0, 0,          
                        distanceFromSun.saturn, distanceFromSun.saturn,          
                        0,  2 * Math.PI,
                        false,            
                        0          
                    ),                         
                    uranus : new THREE.EllipseCurve(
                        0, 0,          
                        distanceFromSun.uranus, distanceFromSun.uranus,          
                        0,  2 * Math.PI,
                        false,            
                        0          
                    ),                         
                    neptune : new THREE.EllipseCurve(
                        0, 0,          
                        distanceFromSun.neptune, distanceFromSun.neptune,          
                        0,  2 * Math.PI,
                        false,            
                        0          
                    )
                }
                
            //Orbit Line Path Setter
                const getOrbitalPath = (planetaryOrbitalPath) => {
                    const points = planetaryOrbitalPath.getPoints( 100 );
                    const geometry = new THREE.BufferGeometry().setFromPoints( points );
                    const material = new THREE.LineBasicMaterial( { color : 0xffffff } );
                    const ellipse = new THREE.Line( geometry, material );
                    ellipse.rotation.x = Math.PI / 2;
                    SoyMilkyWay.add(ellipse);
                }
            
            //Create Planet Function
                const generatePlanet = (name, planetRadius, distanceFromSun, planetUVMap, orbitName, planetaryOrbitalPath, axialTilt ,rings = false) => {
                    const planet = new THREE.Mesh(
                        new THREE.SphereGeometry(planetRadius, 100, 100),
                        new THREE.MeshPhongMaterial({
                            map:new THREE.TextureLoader().load(planetUVMap),
                            color: 0xC5C5C5,
                            emissive: 0x0B0b0b
                        })
                    )
                    //Planet Settings
                    planet.name = name
                    planet.position.set(distanceFromSun, 0, 0);
                    planet.rotation.x = axialTilt
                    SoyMilkyWay.add(planet)
                    //Orbit
                    const planetOrbit = new THREE.Object3D();
                    planetOrbit.name = orbitName
                    SoyMilkyWay.add(planetOrbit)
                    planetOrbit.add(planet)              
                    getOrbitalPath(planetaryOrbitalPath)

                    const planetAndOrbit = {
                        planet: planet,
                        orbit: planetOrbit
                    }
                    spacialEntities.push(planet)
                    return planetAndOrbit;
                }

        //Sun
            const sun = new THREE.Mesh(
                new THREE.SphereGeometry(radiusOfEntities.sun, 64, 64), 
                new THREE.MeshBasicMaterial({
                    map: new THREE.TextureLoader().load("img/sun.jpg"),
                    side: THREE.DoubleSide
                })
            )
            sun.name = "Sun"
            SoyMilkyWay.add(sun)      
            spacialEntities.push(sun)         

        //Planets
            //Mercury
                const mercury = generatePlanet(
                    "Mercury", 
                    radiusOfEntities.mercury, 
                    distanceFromSun.mercury, 
                    "img/mercury.jpg", 
                    "MercuryOrbit", 
                    planetaryOrbitalPath.mercury,
                    0
                );              

            //Venus
                const venus = generatePlanet(
                    "Venus",
                    radiusOfEntities.venus,
                    distanceFromSun.venus,
                    "img/venus.jpg",
                    "Venus Orbit",
                    planetaryOrbitalPath.venus,
                    3.089232776
                );              

            //Earth
                const earth = generatePlanet(
                    "Earth",
                    radiusOfEntities.earth,
                    distanceFromSun.earth,
                    "img/earth.jpg",
                    "Earth Orbit",
                    planetaryOrbitalPath.earth,
                    0.40142572796
                )        

            //Mars
                const mars = generatePlanet(
                    "Mars",
                    radiusOfEntities.mars,
                    distanceFromSun.mars,
                    "img/mars.jpg",
                    "Mars Orbit",
                    planetaryOrbitalPath.mars,
                    0.436332313
                )


            //Jupiter
                const jupiter = generatePlanet(
                    "Jupiter",
                    radiusOfEntities.jupiter,
                    distanceFromSun.jupiter,
                    "img/jupiter.jpg",
                    "Jupiter Orbit",
                    planetaryOrbitalPath.jupiter,
                    0.05235987756
                )
                

            //Saturn
                const saturn = generatePlanet(
                    "Saturn",
                    radiusOfEntities.saturn,
                    distanceFromSun.saturn,
                    "img/saturn.jpg",
                    "Saturn Orbit",
                    planetaryOrbitalPath.saturn,
                    0.47123889804,
                )              
                    
            //Uranus
                const uranus = generatePlanet(
                    "Uranus",
                    radiusOfEntities.uranus,
                    distanceFromSun.uranus,
                    "img/uranus.jpg",
                    "Uranus Orbit",
                    planetaryOrbitalPath.uranus,
                    1.710422667
                )
  
            //Neptune
                const neptune = generatePlanet(
                    "Neptune",
                    radiusOfEntities.neptune,
                    distanceFromSun.neptune,
                    "img/neptune.jpg",
                    "Neptune Orbit",
                    planetaryOrbitalPath.neptune,
                    0.48869219056 
                )

            console.log(spacialEntities)


            const raycaster = new THREE.Raycaster();
            const mouse = new THREE.Vector2();

            function onMouseMove( event ) {

                // calculate mouse position in normalized device coordinates
                // (-1 to +1) for both components

                mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
                mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

            }

            function render() {

                // update the picking ray with the camera and mouse position
                raycaster.setFromCamera( mouse, camera );

                // calculate objects intersecting the picking ray
                const intersects = raycaster.intersectObjects( scene.children );

                for ( let i = 0; i < intersects.length; i ++ ) {

                    intersects[ i ].object.material.color.set( 0xff0000 );

                }

                renderer.render( scene, camera );

            }

            window.addEventListener( 'mousemove', onMouseMove, false );

            window.requestAnimationFrame(render);


        //Planet Movement Functions
            const planetOrbit = () => {
                mercury.orbit.rotation.y +=0.0004736
                venus.orbit.rotation.y +=0.0003502
                earth.orbit.rotation.y += 0.0002978
                mars.orbit.rotation.y += 0.00024077
                jupiter.orbit.rotation.y += 0.0001307
                saturn.orbit.rotation.y += 0.0000969
                uranus.orbit.rotation.y += 0.0000681
                neptune.orbit.rotation.y += 0.0000543
            }
            
            const planetSpin = () => {
                sun.rotation.y += 0.0006975
                mercury.planet.rotation.y += 0.0001083
                venus.planet.rotation.y += 0.0000652
                earth.planet.rotation.y += 0.01674
                mars.planet.rotation.y += 0.00866
                jupiter.planet.rotation.y += 0.45583
                saturn.planet.rotation.y += 0.36840
                uranus.planet.rotation.y += 0.14794
                neptune.planet.rotation.y += 0.09719
            }   

    //Orbitting Function
        const animate = (time) => {


            //cameraPole.rotation.y += 0.001;
            planetSpin()
            planetOrbit();
            controls.update()
            renderer.render(scene, camera);

            requestAnimationFrame(animate);
        }

        requestAnimationFrame(animate);


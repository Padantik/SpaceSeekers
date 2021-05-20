import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import $, { grep } from 'jquery';

$(() => {
    //Favicon Load      
        const favicon = document.getElementById('favicon');
        favicon.href = "Favicon/favicon-32x32.png"

    //Loading Screen
        $(window).on('load', () => {
           setTimeout(removeLoader, 2500);
        });

        const removeLoader = () => {
            $( "#loading-screen" ).fadeOut(750, () => {
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

                const getRadianFromDegrees = (degree) => {
                    let radian = degree * Math.PI/180
                    return radian
                }

            //Distance from the sun value
                const distanceFromSun = {
                    mercury: (radiusOfEntities.sun / 2) + 579.1,
                    venus: (radiusOfEntities.sun / 2) + 1082,
                    earth: (radiusOfEntities.sun / 2) + 1496,
                    mars: (radiusOfEntities.sun / 2) + 2279,
                    jupiter: (radiusOfEntities.sun / 2) + 7786,
                    saturn: (radiusOfEntities.sun / 2) + 14335,
                    uranus: (radiusOfEntities.sun / 2) + 28725,
                    neptune: (radiusOfEntities.sun / 2) + 44951
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
                
                const increaseHoverSizeIfSmall = (planetRadius) => {
                    let radius;
                    if(planetRadius < 5) {
                        radius = planetRadius * 25
                        return radius
                    } else if (planetRadius < 20) {
                        radius = planetRadius * 20
                        return radius
                    } else if (planetRadius < 40) {
                        radius = planetRadius * 15
                        return radius
                    } else {
                        radius = planetRadius * 5
                        return radius
                    }
                }


            //Create Planet Function
                const generatePlanet = (name, planetRadius, distanceFromSun, planetUVMap, planetaryOrbitalPath, axialTilt ,rings = false, ringMap, ringInnerDist, ringOuterDist) => {
                    //Group
                    const planetGroup = new THREE.Group();
                    planetGroup.name = name + "Group"
                    SoyMilkyWay.add(planetGroup)
                    //Orbit
                    const planetOrbit = new THREE.Object3D();
                    planetOrbit.name = name + "Orbit"
                    planetGroup.add(planetOrbit)
                    //Hover
                    const planetHoverMesh = new THREE.Mesh(
                        new THREE.SphereGeometry(increaseHoverSizeIfSmall(planetRadius), 100, 100),
                        new THREE.MeshBasicMaterial({
                            opacity: 0.35,
                            transparent: true
                        })
                    )
                    planetHoverMesh.name = name + "HoverMesh"
                    planetOrbit.add(planetHoverMesh);                   
                    planetHoverMesh.position.set(distanceFromSun, 0, 0);
                    //Planet
                    const planetMesh = new THREE.Mesh(
                        new THREE.SphereGeometry(planetRadius, 100, 100),
                        new THREE.MeshPhongMaterial({
                            map:new THREE.TextureLoader().load(planetUVMap),
                            color: 0xC5C5C5,
                            emissive: 0x0B0b0b
                        })
                    )
                    planetMesh.name = name
                    planetHoverMesh.add(planetMesh);
                    planetMesh.rotation.x = axialTilt        
                    getOrbitalPath(planetaryOrbitalPath)
            
                    if(rings) {
                        const texture = new THREE.TextureLoader().load(
                            ringMap
                          );
                          const geometry = new THREE.RingBufferGeometry(planetRadius + ringInnerDist, planetRadius + ringOuterDist, 64);
                          var pos = geometry.attributes.position;
                          var v3 = new THREE.Vector3();
                          for (let i = 0; i < pos.count; i++){
                           v3.fromBufferAttribute(pos, i);
                            geometry.attributes.uv.setXY(i, v3.length() < (planetRadius + ringOuterDist) - (planetRadius + ringInnerDist) ? 0 : 1, 1);
                          }
                        
                          const material = new THREE.MeshBasicMaterial({
                            map: texture,
                            side: THREE.DoubleSide
                          });
                          const planetRingsMesh = new THREE.Mesh(geometry, material);
                          planetRingsMesh.rotation.x = getRadianFromDegrees(90)
                        
                        planetMesh.add(planetRingsMesh)

                    } 
                    const planetData = {
                        group: planetGroup,
                        orbit: planetOrbit,
                        hover: planetHoverMesh,
                        planet: planetMesh
                    }
                    spacialEntities.push(planetHoverMesh)
                    return planetData;
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
   

        //Planets
            //Mercury
                const mercury = generatePlanet(
                    "Mercury", 
                    radiusOfEntities.mercury, 
                    distanceFromSun.mercury, 
                    "img/mercury.jpg", 
                    planetaryOrbitalPath.mercury,
                    0
                );              
            //Venus
                const venus = generatePlanet(
                    "Venus",
                    radiusOfEntities.venus,
                    distanceFromSun.venus,
                    "img/venus.jpg",
                    planetaryOrbitalPath.venus,
                    getRadianFromDegrees(177)
                );              

            //Earth
                const earth = generatePlanet(
                    "Earth",
                    radiusOfEntities.earth,
                    distanceFromSun.earth,
                    "img/earth.jpg",
                    planetaryOrbitalPath.earth,
                    getRadianFromDegrees(23)
                )        

            //Mars
                const mars = generatePlanet(
                    "Mars",
                    radiusOfEntities.mars,
                    distanceFromSun.mars,
                    "img/mars.jpg",
                    planetaryOrbitalPath.mars,
                    getRadianFromDegrees(25)
                )

            //Jupiter
                const jupiter = generatePlanet(
                    "Jupiter",
                    radiusOfEntities.jupiter,
                    distanceFromSun.jupiter,
                    "img/jupiter.jpg",
                    planetaryOrbitalPath.jupiter,
                    getRadianFromDegrees(3)
                )              

            //Saturn
                const saturn = generatePlanet(
                    "Saturn",
                    radiusOfEntities.saturn,
                    distanceFromSun.saturn,
                    "img/saturn.jpg",
                    planetaryOrbitalPath.saturn,
                    getRadianFromDegrees(27),
                    true,
                    "img/ringsOfSaturn.jpg",
                    7,
                    80
                )              
                    
            //Uranus
                const uranus = generatePlanet(
                    "Uranus",
                    radiusOfEntities.uranus,
                    distanceFromSun.uranus,
                    "img/uranus.jpg",
                    planetaryOrbitalPath.uranus,
                    getRadianFromDegrees(98),
                    true,
                    "img/ringsOfUranus.png",
                    37,
                    39

                )
  
            //Neptune
                const neptune = generatePlanet(
                    "Neptune",
                    radiusOfEntities.neptune,
                    distanceFromSun.neptune,
                    "img/neptune.jpg",
                    planetaryOrbitalPath.neptune,
                    getRadianFromDegrees(28)
                )

            
            const raycaster = new THREE.Raycaster();
            const pointer = new THREE.Vector2();

           
            const getPlanetInfomation = (name, object) => {
                for(let planet = 0; planet < spacialEntities.length; planet++) {
                    spacialEntities[planet].material.opacity = 0.35;
                }
                $("#planetName").html(name)
                $(".planetModal").fadeIn()
                object.material.opacity = 0.5

                $("#planetInfoHUD i").off().on("click", () => {
                    $("#planetInfoModal").modal("show")
                })

                $("#planetExit i").off().on('click', () => {               
                    $(".planetModal").fadeOut()
                    console.log(object)                  
                    object.material.opacity = 0.35
                });
            }

            const getPlanet = ( event ) => {
            
                pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
                pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    
                raycaster.setFromCamera( pointer, camera );
    
                let intersects = raycaster.intersectObjects(spacialEntities);
                if ( intersects.length > 0 ) {
                    
                    const res = intersects.filter(( res ) => {
                        
                        return res.object;
                        
                    } )[ 0 ];
                    let planetName = res.object.children[0].name
                    switch(planetName) {
                        case "Mercury":                              
                            getPlanetInfomation(planetName, res.object)
                            break
                        case "Venus":                                           
                            getPlanetInfomation(planetName, res.object)
                            break                          
                        case "Earth":                                           
                            getPlanetInfomation(planetName, res.object)
                            break                            
                        case "Mars":                                           
                            getPlanetInfomation(planetName, res.object)
                            break                                
                        case "Jupiter":                                           
                            getPlanetInfomation(planetName, res.object)
                            break                         
                        case "Saturn":                                           
                            getPlanetInfomation(planetName, res.object)
                            break
                        case "Uranus":                                           
                            getPlanetInfomation(planetName, res.object)
                            break                          
                        case "Neptune":                                           
                            getPlanetInfomation(planetName, res.object)
                            break                         
                    }  
                }
            }

        //Planet Movement Functions
            //Orbit
            const planetOrbit = (time) => {
                mercury.orbit.rotation.y +=0.0004736 * time
                venus.orbit.rotation.y +=0.0003502 * time
                earth.orbit.rotation.y += 0.0002978 * time
                mars.orbit.rotation.y += 0.00024077 * time
                jupiter.orbit.rotation.y += 0.0001307 * time
                saturn.orbit.rotation.y += 0.0000969 * time
                uranus.orbit.rotation.y += 0.0000681 * time
                neptune.orbit.rotation.y += 0.0000543 * time
            }
            //Spin
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
            planetOrbit(1);
            planetSpin()
            controls.update()
            renderer.render(scene, camera);

            requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);
        $(renderer.domElement.parentElement).on("click", (event) => getPlanet(event));

    })
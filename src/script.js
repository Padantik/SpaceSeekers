import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import $, { grep } from 'jquery'



$(() => {
    //Favicon Load      
        const favicon = document.getElementById('favicon')
        favicon.href = "Favicon/favicon-32x32.png"

    //Loading Screen
        $(window).on('load', () => {
            $( "#loading-screen" ).fadeOut(() => {
                $( "#loading-screen" ).remove()
                setTimeout(() => {
                    $(".secondMsg h2").html("Loading Complete!")
                    setTimeout(() => {  
                        $("#gameTitle").fadeIn()     
                        $(".secondMsg h2").hide()
                        $(".thirdMsg h2").show()
                        $(".thirdMsg h2").off().on("click", () => {
                            $(".welcomeTitle").fadeOut()
                            setTimeout(() => {
                                playStates.loadingScreenPlayState = false
                                start()
                                resetCamera()
                                returnPlanetsToOrginalPostion()
                                $(".speedSettings").css("display", "grid")
                                $("#closeHUD").show()
                            }, 500)           
                        })
                    }, 250)
                }, 500)
            })
        })
    // Debug
        //const gui = new dat.GUI()

    // Canvas
        const canvas = document.querySelector('canvas.webgl')


    //Scene
        const scene = new THREE.Scene()


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
        const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height, 0.1, 150000)
        camera.position.x = 0
        camera.position.y = 2500
        camera.position.z = 7500
        const cameraPole = new THREE.Object3D()
        scene.add(cameraPole)
        cameraPole.add(camera)

        
        
        const controls = new OrbitControls(camera, canvas)
        controls.maxDistance = 55000
        controls.enablePan = false
        

    //Star Generation
        const stars = new THREE.Points(
            new THREE.BufferGeometry(),
            new THREE.PointsMaterial({
                color: 0xffffff
            })
        )
        const starPosition = []
        for(let star = 0; star < 1000; star++) {
            const x = (Math.random() - 0.5) * 100000
            const y = (Math.random() - 0.5) * 100000
            const z = (Math.random() - 0.5) * 100000
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
        const spacialEntities = []
        const SoyMilkyWay = new THREE.Object3D()
        scene.add(SoyMilkyWay)
            
            const sunData = {
                name:"Sun",
                radius: 696.34,
                map: "img/sun.jpg"
            }

                const planetaryOrbitalPath = (planetDistanceFromSun) => {
                    let planet = new THREE.EllipseCurve(
                        0, 0,          
                        planetDistanceFromSun, planetDistanceFromSun,          
                        0,  2 * Math.PI,
                        false,            
                        0    
                    )
                    return planet
                }
            
                const getRadianFromDegrees = (degree) => {
                    let radian = degree * Math.PI/180
                    return radian
                }

            //Orbit Line Path Setter
                const getOrbitalPath = (planetaryOrbitalPath) => {
                    const points = planetaryOrbitalPath.getPoints( 100 )
                    const geometry = new THREE.BufferGeometry().setFromPoints( points )
                    const material = new THREE.LineBasicMaterial({ 
                        color : 0xffffff,
                        transparent: true,
                        opacity: 0.5
                    })
                    const ellipse = new THREE.Line( geometry, material )
                    ellipse.rotation.x = Math.PI / 2
                    SoyMilkyWay.add(ellipse)
                }
                
                const increaseHoverSizeIfFarFromCentre = (planetDistance) => {
                    let radius
                    if(planetDistance < 5000) {
                        radius = 150
                        return radius
                    } else if (planetDistance < 15000) {
                        radius = 300
                        return radius
                    } else if (planetDistance < 30000) {
                        radius = 450
                        return radius
                    } else if (planetDistance < 70000) {
                        radius = 750
                        return radius
                    } else {
                        radius = 900
                        return radius
                    }
                }


            //Create Planet Function
                const generatePlanet = (planet) => {
                    let noNumbersInName = planet.englishName
                    noNumbersInName = noNumbersInName.replace(/[0-9]/g, '')
                   //Group
                   const planetGroup = new THREE.Group()
                   planetGroup.name = noNumbersInName + " Group"
                   SoyMilkyWay.add(planetGroup)
                   //Orbit
                   const planetOrbit = new THREE.Object3D()
                   planetOrbit.name = noNumbersInName + " Orbit"
                   planetGroup.add(planetOrbit)
                   //Hover
                   const planetHoverMesh = new THREE.Mesh(
                       new THREE.SphereGeometry(increaseHoverSizeIfFarFromCentre(sunData.radius / 2 + (planet.semimajorAxis / 100000)), 100, 100),
                       new THREE.MeshBasicMaterial({
                           opacity: 0.30,
                           transparent: true
                       })
                   )
                       planetHoverMesh.name = noNumbersInName + " HoverMesh"
                       planetOrbit.add(planetHoverMesh)
                       planetHoverMesh.position.set((sunData.radius / 2 + (planet.semimajorAxis / 100000)), 0, 0)
                   //Planet
                   const planetMesh = new THREE.Mesh(
                       new THREE.SphereGeometry(planet.meanRadius / 1000, 100, 100),
                       new THREE.MeshPhongMaterial({
                           color: 0xC5C5C5,
                           emissive: 0x0b0b0b
                       })
                   )
                       planetMesh.name = noNumbersInName
                       planetHoverMesh.add(planetMesh)
                       planetMesh.rotation.x = getRadianFromDegrees(planet.axialTilt)
                       getOrbitalPath(planetaryOrbitalPath(sunData.radius / 2 + planet.semimajorAxis / 100000))

                    switch(noNumbersInName) {
                        case "Saturn":
                            createRingsForPlanet("img/ringSaturn.jpg", planet.meanRadius / 1000, 7, 80, planetMesh)
                            break
                        case "Uranus":
                            createRingsForPlanet("img/ringUranus.png", planet.meanRadius / 1000, 37, 39, planetMesh)

                    } 
                    spacialEntities.push(planetHoverMesh)
                    return spacialEntities
                }
        
                //Get Rings
                const createRingsForPlanet = (ringMap, planetRadius, ringInnerRadius, ringOuterRadius, planetMesh) => {
                    const texture = new THREE.TextureLoader().load(ringMap)
                      const geometry = new THREE.RingBufferGeometry(planetRadius + ringInnerRadius, planetRadius + ringOuterRadius, 64)
                      let pos = geometry.attributes.position
                      let v3 = new THREE.Vector3()
                      for (let i = 0; i < pos.count; i++){
                       v3.fromBufferAttribute(pos, i)
                        geometry.attributes.uv.setXY(i, v3.length() < (planetRadius + ringOuterRadius) - (planetRadius + ringInnerRadius) ? 0 : 1, 1)
                      }
                    
                      const material = new THREE.MeshBasicMaterial({
                        map: texture,
                        side: THREE.DoubleSide,
                        opacity:0.5
                      })
                      const planetRingsMesh = new THREE.Mesh(geometry, material)
                      planetRingsMesh.rotation.x = getRadianFromDegrees(90)
                    
                    planetMesh.add(planetRingsMesh)
                }


        //Sun
            const sun = new THREE.Mesh(
                new THREE.SphereGeometry(sunData.radius, 64, 64), 
                new THREE.MeshBasicMaterial({
                    map: new THREE.TextureLoader().load(sunData.map),
                    side: THREE.DoubleSide
                })
            )
            sun.name = sunData.name
            SoyMilkyWay.add(sun)  


    //API GENERATED PLANETS 
        const UVmaps = {
            "Mercury": "img/mercury.jpg",
            "Venus": "img/venus.jpg", 
            "Earth": "img/earth.jpg",
            "Mars": "img/mars.jpg",
            " Ceres": "img/ceres.jpg",
            "Jupiter": "img/jupiter.jpg",
            "Saturn": "img/saturn.jpg",
            "Uranus": "img/uranus.jpg",
            "Neptune": "img/neptune.jpg",
            "Pluto": "img/pluto.jpg",
            " Haumea": "img/haumea.jpg",
            " Makemake": "img/makemake.jpg",
            " Eris": "img/eris.jpg"
        }

        let planets = []
        let planetSpeeds = []
        let orbitSpeedinKMpS = []
        let rotationSpeedInKMpS = []

        //Gets All Planets
        const getAllPlanets = () => {
            $.ajax({
                url: `https://api.le-systeme-solaire.net/rest/bodies/`,
                type: "GET",
                dataType: "json",
                success: (result) => {
                    result.bodies.forEach(planet => {
                        if(planet.isPlanet) {
                            planets.push(planet)
                            generatePlanet(planet)
                            planetSpeeds.push([planet.englishName.replace(/[0-9]/g, ''), planet.sideralOrbit, planet.sideralRotation])
                        }
                    })
                    let orbitSpeed
                    let rotation
                    
                    spacialEntities.forEach(entity => {
                        planetSpeeds.forEach(planetSpeed => {
                            if(planetSpeed[0] == entity.children[0].name) {
                                orbitSpeed = planetSpeed[1]
                                rotation = planetSpeed[2]
                            }
                        })
                    //Get Orbit Speed Of Planets
                        let secondsInAYear = 1 * orbitSpeed * 24 * 60 * 60
                        let radius = entity.position.x  - (sunData.radius / 2)
                        let circumferenceOfOrbit = radius * (2 * Math.PI)
                        
                        orbitSpeedinKMpS.push([entity.children[0].name ,circumferenceOfOrbit / secondsInAYear])
                    
                    //Get Rotation Speed of Planets
                        let secondsInADay = 1 * rotation * 60 * 60
                        let circumferenceOfPlanet = entity.children[0].geometry.parameters.radius * 2 * Math.PI
                        rotationSpeedInKMpS.push([entity.children[0].name , circumferenceOfPlanet / secondsInADay])

                    //Get UV Maps
                        let planetName = entity.children[0].name
                        Object.entries(UVmaps).forEach(map => {
                            if(map[0] == planetName) {
                                entity.children[0].material.map = new THREE.TextureLoader().load(map[1])
                            }
                        }) 
                    })
                }
            })
        }
        getAllPlanets()

        //Orbit
        const planetOrbit = (time) => {
            spacialEntities.forEach(entity => {
                orbitSpeedinKMpS.forEach(planetOrb => {
                    if(entity.children[0].name == planetOrb[0]) {
                        let speedInKm = planetOrb[1]
                        entity.parent.rotation.y += speedInKm * time
                    }
                })
            })
        }
        
        //Spin
        const planetSpin = (time) => {
            spacialEntities.forEach(entity => {
                rotationSpeedInKMpS.forEach(planetSpin => {
                    if(entity.children[0].name == planetSpin[0]) {
                        let speedInKm = planetSpin[1]
                        entity.children[0].rotation.y += speedInKm * time
                    }
                })
            })
        }
             
            
        //Planet Interaction               
            //For Interactivity
            const raycaster = new THREE.Raycaster()
            const pointer = new THREE.Vector2()

            //Get Planet
            const getPlanet = ( event ) => {        
                pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1
                pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1

                raycaster.setFromCamera( pointer, camera )

                let intersects = raycaster.intersectObjects(spacialEntities)
                if ( intersects.length > 0 ) {
                    
                    const res = intersects.filter(( res ) => {
                        
                        return res.object
                        
                    } )[ 0 ]
                    let planetName = res.object.children[0].name
                    getPlanetInfomation(planetName, res.object) 
                }
            }

            const getPlanetInfomation = (name, object) => {
                setHoverMeshOpacity(0.25)
                $("#planetName").html(name)
                $(".HUD").fadeIn()
                object.material.opacity = 0.5
                $("#getInfo").attr("nonce", name)
                console.log($("#getInfo")[0].nonce)

                $("#getInfo").off().on("click", () => {
                    $(".infoModal").fadeToggle()
                })

                $("#closePlanetHUD").off().on('click', () => {               
                    $(".HUD").fadeOut('fast')       
                    setHoverMeshOpacity(0.25)
                })
            }    


        //Misc Functions
            //Reset HoverMesh Opacity
            const setHoverMeshOpacity = (opacity) => {
                spacialEntities.forEach((entity) => {
                    entity.material.opacity = opacity
                    })
            }

            //Resets Camera
            const resetCamera = () => {         
                scene.add(camera)
                camera.position.x = 0
                camera.position.y = 0
                camera.position.z = 0
                camera.position.y += 750
                camera.position.z += 3500              
                controls.saveState()
            }
            //Changes for Orbit Speed
            const playStates = {
                play: true,
                pause: false,
                forward: false,
                backward: false,
                fastForward: false,
                fastBackward: false,

                loadingScreenPlayState: true,
            }
            //Sets Platstates to False (For Reset)
            const setPlaySetToFalse = () => {
                Object.keys(playStates).forEach(state => playStates[state] = false)
            }         
            
            const changeIconToPlay = () => {
                if($("#playPause").hasClass("fas fa-play")) {
                    $("#playPause").removeClass("fas fa-play")
                    $("#playPause").addClass("fas fa-pause")
                }
            }

            const changeSpeedSettings = (control) => {
                let id = $(control)[0].target.id
                switch(id) {
                    case "playPause":
                        if($("#playPause").hasClass("fas fa-pause")) {
                            setPlaySetToFalse()    
                            $("#playPause").removeClass("fas fa-pause")
                            $("#playPause").addClass("fas fa-play")
                            playStates.pause = true
                        } else {
                            setPlaySetToFalse()        
                            changeIconToPlay()
                            playStates.play = true
                        }
                        break
                    case "forward":
                        setPlaySetToFalse()
                        changeIconToPlay()
                        playStates.forward = true
                        break
                    case "fastForward":
                        setPlaySetToFalse()
                        changeIconToPlay()
                        playStates.fastForward = true
                        break
                    case "back":
                        setPlaySetToFalse()
                        changeIconToPlay()
                        playStates.backward = true
                        break
                    case "fastBack":
                        setPlaySetToFalse()                
                        changeIconToPlay()
                        playStates.fastBackward = true
                }
            }
            //Sends Planets Back to there original position
            const returnPlanetsToOrginalPostion = () => {
                spacialEntities.forEach(entity => {
                    entity.parent.rotation.y = 0
                })
            }

            //Close HUD
            const closeHUD = (icon) => {
                $('#hideHUD').toggleClass("down") 
                if($(icon.target).hasClass("down")) {
                    setHoverMeshOpacity(0.25)
                    $(".HUD").hide()
                    $(".cameraReset").fadeOut('fast')
                    $(".speedSettings").fadeOut('fast')
                } else {
                    $(".cameraReset").fadeIn("fast")
                    $(".speedSettings").fadeIn("fast")
                }
            }

            $("#hideHUD").on("click", (icon) => {
                closeHUD(icon) 
            })

            $(".speedSettingsControls i").on("click", (target) => changeSpeedSettings(target))



        //Starting Scene
            const animate = (time) => {
                cameraPole.rotation.y -= 0.00125
                renderer.render(scene, camera)
                
                requestAnimationFrame(animate)

                if(playStates.loadingScreenPlayState) {
                    planetOrbit(25)
                }
            }

            requestAnimationFrame(animate)
      

        //GameScreen
            const start = () => {

                controls.enablePan = true
                setHoverMeshOpacity(0.25)
                setTimeout(() => {
                    $(".cameraReset").fadeIn()
                }, 100)
                $("#cameraReset").on("click", () => {
                    controls.reset()
                })
                $("#planetReset").on("click", () => {            
                    returnPlanetsToOrginalPostion()
                    setPlaySetToFalse()
                    changeIconToPlay()
                    playStates.play = true
                })

            // Controls
                const animate = (time) => {
                    controls.update()
                    cameraPole.rotation.y = 0
                    
                   if(playStates.play) {
                       planetOrbit(1)
                   }
                   if(playStates.pause) {
                       planetOrbit(0)
                   }
                   if(playStates.forward) {
                       planetOrbit(25)
                   }
                   if(playStates.backward) {
                       planetOrbit(-25)
                   } 
                   if(playStates.fastForward) {
                       planetOrbit(50)
                   }
                   if(playStates.fastBackward) {
                       planetOrbit(-50)
                   } 


                   planetSpin(5)

                    renderer.render(scene, camera)
                    requestAnimationFrame(animate)
                }
                requestAnimationFrame(animate)
                $(renderer.domElement.parentElement).on("click", (event) => getPlanet(event))
            }
          
            


    })
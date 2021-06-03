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
                                $(".resetMenu").fadeIn("fast")
                                $("#closeHUD").show()
                            }, 500)           
                        })
                    }, 2500)
                }, 5000)
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
        //For Responsive viewing
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
    
        //Orbit Controls
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
                const x = (Math.random() - 0.5) * 500000
                const y = (Math.random() - 0.5) * 500000
                const z = (Math.random() - 0.5) * 500000
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

            //PlanetOrbit
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

            //Orbit Line Path Setter
            const getOrbitalPath = (planetaryOrbitalPath) => {
                const points = planetaryOrbitalPath.getPoints( 50000 )
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

            //Calculates Radian for Axis
            const getRadianFromDegrees = (degree) => {
                let radian = degree * Math.PI/180
                return radian
            }
            //For distant planet Visibility
            const increaseHoverSizeIfFarFromCentre = (planetDistance) => {
                let radius
                if(planetDistance < 5000) {
                    radius = 150
                    return radius
                } else if (planetDistance < 20000) {
                    radius = 350
                    return radius
                } else {
                    radius = 600
                    return radius
                }
            }

            //Create Planet Function
                const generatePlanet = (planet) => {
                   //Group
                   const planetGroup = new THREE.Group()
                   planetGroup.name = planet.englishName + " Group"
                   SoyMilkyWay.add(planetGroup)
                   //Orbit
                   const planetOrbit = new THREE.Object3D()
                   planetOrbit.name = planet.englishName + " Orbit"
                   planetGroup.add(planetOrbit)
                   //Hover
                   const planetHoverMesh = new THREE.Mesh(
                       new THREE.SphereGeometry(increaseHoverSizeIfFarFromCentre(sunData.radius / 2 + (planet.semimajorAxis / 100000)), 100, 100),
                       new THREE.MeshBasicMaterial({
                           opacity: 0.2,
                           transparent: true
                       })
                   )
                       planetHoverMesh.name = planet.englishName + " HoverMesh"
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
                       planetMesh.name = planet.englishName
                       planetHoverMesh.add(planetMesh)
                       planetMesh.rotation.x = getRadianFromDegrees(planet.axialTilt)
                       getOrbitalPath(planetaryOrbitalPath(sunData.radius / 2 + planet.semimajorAxis / 100000))

                    switch(planet.englishName) {
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
            const sunData = {
                name:"Sun",
                radius: 696.34,
                map: "img/sun.jpg"
            }   
            const sun = new THREE.Mesh(
                new THREE.SphereGeometry(sunData.radius, 64, 64), 
                new THREE.MeshBasicMaterial({
                    map: new THREE.TextureLoader().load(sunData.map),
                    side: THREE.DoubleSide
                })
            )
            sun.name = sunData.name
            SoyMilkyWay.add(sun)  

    //Planet Loading
        //Global Arrays
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
                            if(planet.isPlanet && planet.meanRadius > 2000) {
                                planets.push(planet)
                                generatePlanet(planet)
                                planetSpeeds.push([planet.englishName, planet.sideralOrbit, planet.sideralRotation])
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
        
            //UV Mapping
                const UVmaps = {
                    "Mercury": "img/mercury.jpg",
                    "Venus": "img/venus.jpg", 
                    "Earth": "img/earth.jpg",
                    "Mars": "img/mars.jpg",
                    "Jupiter": "img/jupiter.jpg",
                    "Saturn": "img/saturn.jpg",
                    "Uranus": "img/uranus.jpg",
                    "Neptune": "img/neptune.jpg"
                }

            //Orbit Speed
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
            
            //Rotation Speed
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
            //Gets Clicked Area
                const raycaster = new THREE.Raycaster()
                const pointer = new THREE.Vector2()
                const getPlanetFromClick = ( event ) => {     
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
            //Planet Data Loader
                const getPlanetInfomation = (name, object) => {
                    
                    //let childPlaneWorldPosition = object.getWorldPosition();
                    
                    //controls.target = new THREE.Vector3(childPlaneWorldPosition);
                    //console.log(childPlaneWorldPosition)

                    setHoverMeshOpacity(0.2)
                    object.material.opacity = 0.35

                    $("#planetName").html(name)
                    $(".HUD").fadeIn()
                    
                    planets.forEach(planet => {
                        if(planet.englishName == name) {
                            displayPlanetDataOnTable(planet)
                        }
                    })
                    if($(".infoModal").css("display") == "block" && name == "Earth") {
                        $("#compareToEarth").fadeOut("fast")
                    } else if($(".infoModal").css("display") == "block" && name != "Earth")
                        $("#compareToEarth").fadeIn("fast")
                    }    

            //Saves information modal as an array for easy access
                const tableElements = $("#displayDataTable")[0].children
                let dataTableDisplay = []
                $(tableElements).each((element) => {
                    dataTableDisplay.push(tableElements[element].children)
                })
                let planetData = []
                dataTableDisplay.forEach(element => {
                    planetData.push(element)
                })
            //Renders Data to Table
                const displayPlanetDataOnTable = (planet) => { 
                    setPlanetData(planet)               
                    $("#getInfo").off().on("click", () => {
                        $(".speedSettings").fadeOut('fast')
                        $(".infoModal").fadeIn("fast")
                        setPlanetData(planet)
                        deleteComparisonString($("#planetName").text())
                        
                        if(planet.englishName != "Earth") {
                            $("#compareToEarth").fadeIn("fast")
                        } else {
                            $("#compareToEarth").fadeOut("fast")
                        }
                    })
                    
                    $("#closePlanetHUD").off().on('click', () => {
                        $(".infoModal, #compareToEarth").fadeOut('fast')
                        $(".speedSettings").fadeIn('fast')
                        $("#planetName").html(planet.englishName)
                    })

                    $("#compareToEarth").off().on("click", () => {
                        comparePlanetDataToEarth(planet)
                        $("#planetName").html(`${planet.englishName} / Earth`)
                    })
                }
            //Renders information to table
                const setPlanetData = (planet) => {
                    if(planet.moons == null) {
                        planetData[0][1].innerHTML = 0
                    } else {   
                        planetData[0][1].innerHTML = planet.moons.length
                    }
                    planetData[1][0].innerHTML = "Distance from Sun"
                    planetData[1][1].innerHTML = `${commafy(planet.semimajorAxis)} km`

                    planetData[2][0].innerHTML = "Orbital Period"
                    planetData[2][1].innerHTML = `${commafy(planet.sideralOrbit.toFixed(2))} days`

                    planetData[3][0].innerHTML = "Day Length"
                    planetData[3][1].innerHTML = `${commafy(Math.abs(planet.sideralRotation).toFixed(2))} hours`

                    planetData[4][0].innerHTML = "Axial Tilt"
                    planetData[4][1].innerHTML = `${planet.axialTilt.toFixed(2)}°`

                    planetData[5][0].innerHTML = "Radius"
                    planetData[5][1].innerHTML = `${commafy(planet.meanRadius.toFixed(2))} km`

                    planetData[6][0].innerHTML = "Surface Area"
                    planetData[6][1].innerHTML = `${commafy((4 * Math.PI * Math.pow(planet.meanRadius, 2)).toFixed(2))} km<sup>2</sup>`

                    planetData[7][0].innerHTML = "Mass"
                    planetData[7][1].innerHTML = `${commafy(planet.mass.massValue.toFixed(2))}<sup>${planet.mass.massExponent}</sup> kg`

                    planetData[8][0].innerHTML = "Volume"
                    planetData[8][1].innerHTML = `${commafy(planet.vol.volValue.toFixed(2))}<sup>${planet.vol.volExponent}</sup> km<sup>3</sup>`

                    planetData[9][0].innerHTML= "Density"
                    planetData[9][1].innerHTML = `${commafy(planet.density.toFixed(2))} g/cm<sup>3</sup>`

                    planetData[10][0].innerHTML = "Gravity"
                    planetData[10][1].innerHTML = `${planet.gravity.toFixed(2)} m/s<sup>2</sup>`

                    planetData[11][0].innerHTML = "Escape Velocity"
                    planetData[11][1].innerHTML = `${planet.escape.toFixed(2)} km/s`
                }
            //Compares current planet selected information to Earth
                const comparePlanetDataToEarth = (planet) => {
                    const earthData = getEarthDataForComparison()

                    if(planet.moons == null) {
                        planetData[0].innerHTML = 0
                    } else {   
                        planetData[0].innerHTML = `+${planet.moons.length - earthData.moons.length}`
                    }
                    planetData[1][0].innerHTML = "Distance from Earth"
                    planetData[1][1].innerHTML = `${commafy(Math.abs(earthData.semimajorAxis - planet.semimajorAxis))} km`

                    planetData[2][0].innerHTML = `1 year on ${planet.englishName}`
                    planetData[2][1].innerHTML = `${commafy((planet.sideralOrbit / earthData.sideralOrbit).toFixed(2))} Earth years`

                    planetData[3][0].innerHTML = `1 day on ${planet.englishName}`
                    planetData[3][1].innerHTML = `${commafy(Math.abs(planet.sideralRotation / earthData.sideralRotation).toFixed(2))} Earth days`

                    planetData[4][0].innerHTML = "Axial Difference"
                    planetData[4][1].innerHTML = `${Math.abs(planet.axialTilt - earthData.axialTilt).toFixed(2)}°`
                    planetData[5][1].innerHTML = `x${(planet.meanRadius / earthData.meanRadius).toFixed(2)} km`
                    planetData[6][1].innerHTML = `x${(4 * Math.PI * Math.pow(planet.meanRadius, 2) / (4 * Math.PI * Math.pow(earthData.meanRadius, 2))).toFixed(2)}  km<sup>2</sup>`
                    planetData[7][1].innerHTML = `x${((planet.mass.massValue * Math.pow(10, planet.mass.massExponent)) / (earthData.mass.massValue * Math.pow(10, earthData.mass.massExponent))).toFixed(4)} kg`
                    planetData[8][1].innerHTML = `x${((planet.vol.volValue * Math.pow(10, planet.vol.volExponent) / (earthData.vol.volValue * Math.pow(10, earthData.vol.volExponent))).toFixed(4))} km<sup>3</sup>`
                    planetData[9][1].innerHTML = `x${(planet.density / earthData.density).toFixed(2)} g/cm<sup>3</sup>`
                    planetData[10][1].innerHTML = `x${(planet.gravity / earthData.gravity).toFixed(2)} m/s<sup>2</sup>`
                    planetData[11][1].innerHTML = `x${(planet.escape / earthData.escape).toFixed(2)} km/s`
                }

            //Misc Functions / Objects
                //Earth Data
                const getEarthDataForComparison = () => {
                    let earthData = {}
                    planets.forEach(earth => {
                        if(earth.englishName == "Earth") {
                        earthData = earth
                        }
                    })
                    return earthData
                }
                //Reset HoverMesh Opacity
                const setHoverMeshOpacity = (opacity) => {
                    spacialEntities.forEach((entity) => {
                        entity.material.opacity = opacity
                        })
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
                //For Speed Icons
                const changeIconToPlay = () => {
                    if($("#playPause").hasClass("fas fa-play")) {
                        $("#playPause").removeClass("fas fa-play")
                        $("#playPause").addClass("fas fa-pause")
                    }
                }
                //Playstate speed
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
                //Resets Camera
                const resetCamera = () => {         
                    scene.add(camera)
                    camera.position.x = 0
                    camera.position.y = 750
                    camera.position.z = 3500              
                    controls.saveState()
                }
                //Close HUD
                const closeHUD = (icon) => {
                    $('#hideHUD').toggleClass("down")
                    setHoverMeshOpacity(0.2) 
                    if($(icon.target).hasClass("down")) {
                        $(".infoModal, .HUD, .resetMenu, .speedSettings, #compareToEarth").fadeOut("fast")
                    } else {
                        $(".resetMenu, .speedSettings").fadeIn("fast")
                    }
                }
                //Adds Commas for Display Purposes      
                const commafy = ( num ) => {
                    let str = num.toString().split('.')
                    if (str[0].length >= 4) {
                        str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,')
                    }
                    if (str[1] && str[1].length >= 4) {
                        str[1] = str[1].replace(/(\d{3})/g, '$1 ')
                    }
                    return str.join('.')
                }

                const deleteComparisonString = (string) => {
                    if(string.includes(" / Earth")) {
                        let name = string.split(" / Earth")
                        $("#planetName").html(name[0])
                    }
                }


            //EVENT LISTENERS

                $("#hideHUD").on("click", (icon) => {
                    closeHUD(icon)
                })

                $(".speedSettingsControls i").on("click", (target) => changeSpeedSettings(target))

                $("#resetMenu").on("click", () => {
                    $(".resetMenu-content").addClass("showDropDown")
                    setTimeout(() => {                  
                        $(".resetMenu-content").removeClass("showDropDown")
                    }, 4000)
                })
                
                
                
        //Starting Scene
            const animate = (time) => {
                cameraPole.rotation.y -= 0.00125
                sun.rotation.y += 0.00065
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
                $("#cameraReset").on("click", () => controls.reset())
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
                $(renderer.domElement.parentElement).on("pointerdown", (event) => getPlanetFromClick(event))
            }
    })
var scene, renderer, camera, sphere, groundGeometry, cube, controls;

      var socket = io.connect('http://localhost');
      socket.on('orient', function (data) {
          handleOrientation(data);
      });

      function handleOrientation (data) {
        var orientData = {};

        orientData.y = Math.round(data.y),
        orientData.x = Math.round(data.x),
        orientData.z = Math.round(data.z);

        renderData(orientData);
      }
      function renderData (data) {
        var vector = {
          x: -data.x * 10,
          z: data.y * 10
        };

        sphere.setLinearVelocity( new THREE.Vector3(vector.x, 0, vector.z) );
      }
      function animate() {
        requestAnimationFrame(animate);
        render();
      }
      function render() {
        scene.simulate()
        renderer.render(scene, camera);
        controls.update();
      }
      function initScene() {
        var WIDTH = window.innerWidth,
            HEIGHT = window.innerHeight;

        var VIEW_ANGLE = 45,
            ASPECT = WIDTH / HEIGHT,
            NEAR = 1,
            FAR = 10000;

        var container = document.querySelector('.viewport');

        renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.shadowMapEnabled = true;
        renderer.shadowMapSoft = true;
        renderer.shadowMapType = THREE.PCFShadowMap;
        renderer.shadowMapAutoUpdate = true;

        camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);

        controls = new THREE.OrbitControls(camera);

        scene.add(camera);
        camera.position.y = 1000;
        camera.position.z = 700;
        camera.rotation.x = -Math.PI/3;
        renderer.setSize(WIDTH, HEIGHT);
        container.appendChild(renderer.domElement);

        drawObj();
      }
      function drawObj() {
        var radius = 25,
            segments = 32,
            rings = 32;

        var sphereMaterial = Physijs.createMaterial(
          new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('img/rock.jpg')
          }),
          .7,
          .1
        );
        var cubeMaterial = Physijs.createMaterial(
          new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('img/box.jpg')
          }),
          .4,
          .3
        );
        var boxMaterial = Physijs.createMaterial(
          new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('img/box2.jpg')
          }),
          .3,
          .5
        );
        var groundGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);

        for (var i = 0; i < 20; i++) {
          var material = cubeMaterial,
              weight = 30;

          if (i >= 4 && i <= 8) {
            material = boxMaterial;
            weight = 1;
          }

          cube = new Physijs.BoxMesh(
            new THREE.CubeGeometry(60, 60, 60),
            material,
            weight
          );

          var rx = Math.random() * (300 + 300) - 300,
              rz = Math.random() * (400 + 400) - 400;

          cube.position.x = rx;
          cube.position.z = rz;
          cube.position.y = 100;
          cube.receiveShadow = true;
          cube.castShadow = true;

          scene.add(cube);
        }

        sphere = new Physijs.SphereMesh(
          new THREE.SphereGeometry(radius, segments, rings),
          sphereMaterial,
          100
        );
        sphere.position.y = 400;
        sphere.position.x = 160;
        sphere.receiveShadow = true;
        sphere.castShadow = true;

        groundGeometry.computeFaceNormals();
        groundGeometry.computeVertexNormals();

        var groundMaterial = Physijs.createMaterial(
          new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('img/ground.jpg')
          }),
          1,
          .2
        );

        var ground = new Physijs.BoxMesh(groundGeometry, groundMaterial, 0);

        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        ground.castShadow = true;

        scene.add(ground);

        var light = new THREE.SpotLight(0xffffff);

        light.shadowCameraTop = -700;
        light.shadowCameraLeft = -700;
        light.shadowCameraRight = 700;
        light.shadowCameraBottom = 700;
        light.shadowCameraNear = 20;
        light.shadowCameraFar = 1400;
        light.shadowBias = -.0001;
        light.shadowMapWidth = light.shadowMapHeight = 1024;
        light.shadowDarkness = .3;
        light.castShadow = true;
        light.shadowCameraVisible = false;
        light.position.set(200, 600, 800);

        scene.add(sphere);
        scene.add(light);

        renderer.render(scene, camera);
      }
      function initPhysX() {
        Physijs.scripts.worker = 'js/physijs/physijs_worker.js';
        Physijs.scripts.ammo = 'ammo.js';

        scene = new Physijs.Scene({reportsize: 50, fixedTimeStep: 1 / 60});
        scene.setGravity(new THREE.Vector3( 0, -800, 0 ));
      }

      initPhysX();
      initScene();
      animate();

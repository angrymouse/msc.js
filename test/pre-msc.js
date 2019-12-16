var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var world = new CANNON.World();


var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
//renderer.shadowMap.enabled = true;

document.body.appendChild(renderer.domElement);

camera.position.z = 5;

window.MSC = {}

MSC.Ticker = (fun) => {
  let stop = false;

  function externalTicker() {
    if (stop) {
      return
    }
    fun();
    requestAnimationFrame(externalTicker)
  }
  requestAnimationFrame(externalTicker)
  return {
    stop: () => {
      stop = true
    }
  }
};
MSC.GetSprite = (sprite) => {

  sprite.ErasePhysics = () => {}
  sprite.setPhysics = (type, mass) => {
    switch (type) {
      case "sphere":
        sprite.ErasePhysics()

        sprite.shape = new CANNON.Sphere(Math.max(sprite.scale.x, sprite.scale.y, sprite.scale.z))
        sprite.body = new CANNON.Body({
          mass: mass,
          shape: sprite.shape
        })
        sprite.body.position.copy(sprite.position)
        world.add(sprite.body)
        sprite.st = () => {
          requestAnimationFrame(sprite.st)
          sprite.position.copy(sprite.body.position)
          sprite.quaternion.copy(sprite.body.quaternion);
        }
        sprite.st()
        sprite.ErasePhysics = () => {
          world.remove(sprite.body)
          sprite.st = () => {}
        }
        return sprite;
        break;
      case "plane":
        sprite.ErasePhysics()

        sprite.shape = new CANNON.Plane(Math.max(sprite.scale.x, sprite.scale.y, sprite.scale.z))
        sprite.body = new CANNON.Body({
          mass: mass,
          shape: sprite.shape
        })
        sprite.body.position.copy(sprite.position)
      //  sprite.body.rotation.copy(sprite.rotation)
        world.add(sprite.body)
        sprite.st = () => {
          requestAnimationFrame(sprite.st)
          sprite.position.copy(sprite.body.position)
          sprite.quaternion.copy(sprite.body.quaternion);
        //  sprite.rotation.copy(sprite.body.rotation)
        }
        sprite.st()
        sprite.ErasePhysics = () => {
          world.remove(sprite.body)
          sprite.st = () => {}
        }
        return sprite;
        break;


    }
  }
  return sprite
}
MSC.Gltf = (fn, cb) => {
  let loader = new THREE.GLTFLoader();
  loader.load(fn, (sprite) => {
    sprite = sprite.scene
    sprite = MSC.GetSprite(sprite)
    cb(sprite)
  })
}
MSC.lookAt = (obj) => {
  camera.lookAt(obj.position.x, obj.position.y, obj.position.z)
}
MSC.key = function keyboard(value) {
  let key = {};
  key.value = value;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = event => {
    if (event.key === key.value) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
      event.preventDefault();
    }
  };

  //The `upHandler`
  key.upHandler = event => {
    if (event.key === key.value) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
      event.preventDefault();
    }
  };

  //Attach event listeners
  const downListener = key.downHandler.bind(key);
  const upListener = key.upHandler.bind(key);

  window.addEventListener(
    "keydown", downListener, false
  );
  window.addEventListener(
    "keyup", upListener, false
  );

  // Detach event listeners
  key.unsubscribe = () => {
    window.removeEventListener("keydown", downListener);
    window.removeEventListener("keyup", upListener);
  };

  return key;
}
MSC.attachMouseControllers = (camera) => {

  //document.body.requestPointerLock();
  document.addEventListener("click", () => {
    document.body.requestPointerLock();
  })
  document.addEventListener('mousemove', (a1) => {

    camera.rotateY(-a1.movementX / 200)
    //camera.rotateX(-a1.movementY/200)

  })
}
MSC.attachWSControllers = (camera) => {
  let dir = new THREE.Vector3()
  let w = MSC.key("w")
  w.press = () => {
    let t = MSC.Ticker(() => {
      camera.translateZ(-0.1)
    })
    w.release = () => {

      t.stop()
    }
  }
  let s = MSC.key("s")
  s.press = () => {
    let t = MSC.Ticker(() => {
      camera.getWorldDirection(dir);
      camera.position.addScaledVector(dir, -0.3);
    })
    s.release = () => {
      t.stop()
    }
  }
  let a = MSC.key("a")
  a.press = () => {
    let dir = new THREE.Vector3(0, 0, 0) //camera.rotation.y, camera.rotation.z)
    let t = MSC.Ticker(() => {
      camera.getWorldDirection(dir);
      camera.position.addScaledVector(dir, -0.3);
    })
    a.release = () => {
      t.stop()
    }
  }
}
MSC.CollideBoxes = (object1, object2) => {
  object1 = object1.children[3]
  object2 = object2.children[3]
  object1.geometry.computeBoundingBox(); //not needed if its already calculated
  object2.geometry.computeBoundingBox();
  object1.updateMatrixWorld();
  object2.updateMatrixWorld();

  var box1 = object1.geometry.boundingBox.clone();
  box1.applyMatrix4(object1.matrixWorld);

  var box2 = object2.geometry.boundingBox.clone();
  box2.applyMatrix4(object2.matrixWorld);

  return box1.intersectsBox(box2);

}
MSC.CreateBasicLight = (skyColor, groundColor, power) => {
  return new THREE.HemisphereLight(skyColor, groundColor, power)
}
MSC.setWorldGravity = (x, y, s) => {
  world.gravity.set(x, y, s)
}
MSC.GetPlane = (w, h, l, m) => {
  let g = new THREE.PlaneGeometry(w, h, l);
  let r = new THREE.Mesh(g, m);
  r= MSC.GetSprite(r);
  return r
}

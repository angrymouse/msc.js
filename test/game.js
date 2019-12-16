scene.add(MSC.CreateBasicLight(0xffffbb,0x80820,1))
world.gravity.set(0,0,-1)
MSC.Gltf("tree.glb",(tree)=>{
  window.tree=tree
  console.log(tree);
scene.add(tree)
tree.setPhysics("sphere",9)

let groundMaterial = new THREE.MeshBasicMaterial( { color: 0xffff00,side:THREE.DoubleSide } );
let ground=MSC.GetPlane(100,100,1,groundMaterial)
ground.rotation.x=1.5
ground.position.y=-4
ground.setPhysics("plane",1)
scene.add(ground)
})
MSC.attachMouseControllers(camera)
MSC.attachWSControllers(camera)

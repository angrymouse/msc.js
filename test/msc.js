
function animate() {
	requestAnimationFrame( animate );
  world.step(0.016)
	renderer.render( scene, camera );

}
animate();

(function() {
  fabric.config.configure({
    enableGLFiltering: false
  });
  var visualTestLoop;
  var getFixture;
  var isFirefox = false;
  if (fabric.getEnv().isLikelyNode) {
    visualTestLoop = global.visualTestLoop;
    getFixture = global.getFixture;
  }
  else {
    visualTestLoop = window.visualTestLoop;
    getFixture = window.getFixture;
    isFirefox = window.navigator.userAgent.includes('Firefox/')
  }

  var tests = [];

  function imageResizeTest(canvas, callback) {
    getFixture('parrot.png', false, function(img) {
      var zoom = 8;
      var image = new fabric.Image(img);
      image.resizeFilter = new fabric.filters.Resize({ resizeType: 'lanczos' });
      canvas.setZoom(zoom);
      image.scaleToWidth(canvas.width / zoom);
      canvas.add(image);
      canvas.renderAll();
      callback(canvas.lowerCanvasEl);
      image.dispose();
    });
  }

  tests.push({
    test: 'Image resize with canvas zoom',
    code: imageResizeTest,
    golden: 'parrot.png',
    newModule: 'Image resize filter test',
    percentage: 0.08,
    disabled: isFirefox,
    width: 200,
    height: 200,
    beforeEachHandler: function() {
      fabric.Object.prototype.objectCaching = false;
    }
  });

  function imageResizeTestNoZoom(canvas, callback) {
    getFixture('parrot.png', false, function(img) {
      var image = new fabric.Image(img);
      image.resizeFilter = new fabric.filters.Resize({ resizeType: 'lanczos' });
      image.scaleToWidth(canvas.width);
      canvas.add(image);
      canvas.renderAll();
      callback(canvas.lowerCanvasEl);
      image.dispose();
    });
  }

  tests.push({
    test: 'Image resize without zoom',
    code: imageResizeTestNoZoom,
    golden: 'parrot.png',
    disabled: isFirefox,
    percentage: 0.08,
    width: 200,
    height: 200,
  });

  function imageResizeTestAnamorphic(canvas, callback) {
    getFixture('parrot.png', false, function(img) {
      var image = new fabric.Image(img);
      image.resizeFilter = new fabric.filters.Resize({ resizeType: 'lanczos' });
      image.scaleY = 0.3;
      image.scaleX = 1;
      canvas.add(image);
      canvas.renderAll();
      callback(canvas.lowerCanvasEl);
      image.dispose();
    });
  }

  tests.push({
    test: 'Image resize with scaleY != scaleX',
    code: imageResizeTestAnamorphic,
    golden: 'parrotxy.png',
    percentage: 0.08,
    disabled: isFirefox,
    width: 200,
    height: 200,
  });

  function imageResizeTestGroup(canvas, callback) {
    getFixture('parrot.png', false, function(img) {
      var image = new fabric.Image(img, { strokeWidth: 0 });
      image.resizeFilter = new fabric.filters.Resize({ resizeType: 'lanczos' });
      var group = new fabric.Group([image]);
      group.strokeWidth = 0;
      group.scaleToWidth(canvas.width);
      canvas.add(group);
      canvas.renderAll();
      image.dispose();
      callback(canvas.lowerCanvasEl);
    });
  }

  tests.push({
    test: 'Image resize with scaled group',
    code: imageResizeTestGroup,
    golden: 'parrot.png',
    disabled: isFirefox,
    percentage: 0.08,
    width: 200,
    height: 200,
  });

  function blendImageTest2(canvas, callback) {
    getFixture('parrot.png', false, function(img) {
      var image = new fabric.Image(img);
      var backdropImage = new fabric.Image(img);
      backdropImage.left = backdropImage.width;
      backdropImage.scaleX = -1;
      image.filters.push(new fabric.filters.BlendImage({ image: backdropImage }));
      image.applyFilters();
      image.scaleToWidth(400);
      canvas.add(image);
      canvas.renderAll();
      image.dispose();
      backdropImage.dispose();
      callback(canvas.lowerCanvasEl);
    });
  }

  tests.push({
    test: 'Blend image test with flip',
    code: blendImageTest2,
    golden: 'parrotblend2.png',
    newModule: 'Image Blend test',
    percentage: 0.06,
    width: 400,
    height: 400,
  });

  function blendImageTest(canvas, callback) {
    getFixture('parrot.png', false, function(img) {
      getFixture('very_large_image.jpg', false, function(backdrop) {
        var image = new fabric.Image(img);
        var backdropImage = new fabric.Image(backdrop);
        image.filters.push(new fabric.filters.BlendImage({image: backdropImage, alpha: 0.5 }));
        image.scaleToWidth(400);
        image.applyFilters();
        canvas.add(image);
        canvas.renderAll();
        callback(canvas.lowerCanvasEl);
      });
    });
  }

  tests.push({
    test: 'Blend image test',
    code: blendImageTest,
    golden: 'parrotblend.png',
    percentage: 0.06,
    width: 400,
    height: 400,
  });

  tests.forEach(visualTestLoop(QUnit));
})();

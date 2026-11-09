let cars = [];
let selectedBrand = "";
let buttons = [];

let colors = {
  Volkswagen: [35, 95, 190],
  BMW: [65, 165, 220],
  Mercedes: [235, 180, 45],
  Audi: [220, 65, 65]
};


// carica i dti
function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("Arial");
  loadData();
}


// legge il csv
async function loadData() {
  let response = await fetch("cars.csv");
  let text = await response.text();
  let rows = text.trim().split("\n");

  for (let i = 1; i < rows.length; i++) {
    let v = rows[i].split(",");

    cars.push({
      brand: v[0].trim(),
      model: v[1].trim(),
      year: Number(v[2]),
      registrations: Number(v[3])
    });
  }
}


// disegna tuto
function draw() {
  background(246, 244, 238);

  drawTitle();

  if (cars.length == 0) return;

  if (selectedBrand == "") {
    drawBrands();
  } else {
    drawModels();
  }

  drawLegend();
}


// titolo princpale
function drawTitle() {
  fill(18);
  noStroke();

  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(58);

  text("GERMAN CARS", 60, 45);

  fill(90);
  textStyle(NORMAL);
  textSize(13);

  if (selectedBrand == "") {
    text(
      "NEW CAR REGISTRATIONS IN GERMANY — 2025",
      64,
      116
    );
  } else {
    text(
      selectedBrand.toUpperCase() + " — MODELS",
      64,
      116
    );
  }

  // anno sopra
  fill(18);
  rect(width - 140, 55, 80, 34, 17);

  fill(255);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(12);

  text("2025", width - 100, 72);
}


// marche principlai
function drawBrands() {
  buttons = [];

  let brands = [
    "Volkswagen",
    "BMW",
    "Mercedes",
    "Audi"
  ];

  let spacing = width / 5;
  let y = height * 0.52;

  for (let i = 0; i < brands.length; i++) {
    let brand = brands[i];
    let x = spacing * (i + 1);
    let total = getTotal(brand);

    // dimenzione dal dato
    let size = map(total, 80000, 230000, 115, 190);

    // hover semplcie
    if (dist(mouseX, mouseY, x, y) < size / 2) {
      size += 10;
    }

    drawCircle(x, y, size, brand);

    // nome e dato
    fill(18);
    textAlign(CENTER, TOP);
    textStyle(BOLD);
    textSize(14);

    text(
      brand.toUpperCase(),
      x,
      y + size / 2 + 25
    );

    fill(100);
    textStyle(NORMAL);
    textSize(12);

    text(
      total.toLocaleString("it-IT"),
      x,
      y + size / 2 + 47
    );

    buttons.push({
      brand: brand,
      x: x,
      y: y,
      size: size
    });
  }

  fill(110);
  textAlign(CENTER);
  textSize(11);

  text(
    "CLICK A BRAND TO EXPLORE",
    width / 2,
    height - 105
  );
}


// modelli selezionti
function drawModels() {
  let models = cars.filter(
    car => car.brand == selectedBrand
  );

  let c = colors[selectedBrand];

  let brandX = width * 0.27;
  let brandY = height * 0.55;

  // marca grande
  drawCircle(
    brandX,
    brandY,
    170,
    selectedBrand
  );

  fill(18);
  textAlign(CENTER);
  textStyle(BOLD);
  textSize(15);

  text(
    selectedBrand.toUpperCase(),
    brandX,
    brandY + 110
  );


  // posizoni modelli
  let positions = [
    [width * 0.57, height * 0.32],
    [width * 0.72, height * 0.53],
    [width * 0.57, height * 0.74]
  ];


  for (let i = 0; i < models.length; i++) {
    let car = models[i];

    let x = positions[i][0];
    let y = positions[i][1];

    let size = map(
      car.registrations,
      24000,
      85000,
      65,
      125
    );

    // hover modeloo
    if (dist(mouseX, mouseY, x, y) < size / 2) {
      size += 8;
    }

    // colegamento
    stroke(c[0], c[1], c[2]);
    strokeWeight(1.5);

    line(
      brandX,
      brandY,
      x,
      y
    );

    noStroke();

    drawCircle(
      x,
      y,
      size,
      selectedBrand
    );

    // nome modello
    fill(18);
    textAlign(LEFT, CENTER);
    textStyle(BOLD);
    textSize(14);

    text(
      car.model.toUpperCase(),
      x + size / 2 + 18,
      y - 8
    );

    fill(100);
    textStyle(NORMAL);
    textSize(12);

    text(
      car.registrations.toLocaleString("it-IT"),
      x + size / 2 + 18,
      y + 14
    );
  }


  // tasto indietro
  fill(18);
  rect(60, 145, 100, 32, 16);

  fill(255);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(11);

  text("← BACK", 110, 161);
}


// disegna il glfio
function drawCircle(x, y, size, brand) {
  let c = colors[brand];

  fill(c[0], c[1], c[2]);
  noStroke();

  circle(x, y, size);
}


// somma i dti
function getTotal(brand) {
  let total = 0;

  for (let car of cars) {
    if (car.brand == brand) {
      total += car.registrations;
    }
  }

  return total;
}


// click marche
function mousePressed() {
  if (selectedBrand == "") {

    for (let b of buttons) {
      if (
        dist(mouseX, mouseY, b.x, b.y)
        < b.size / 2
      ) {
        selectedBrand = b.brand;
      }
    }

  } else {

    // torna indieto
    if (
      mouseX > 60 &&
      mouseX < 160 &&
      mouseY > 145 &&
      mouseY < 177
    ) {
      selectedBrand = "";
    }
  }
}


// legenda soto
function drawLegend() {
  fill(18);

  textAlign(LEFT);
  textStyle(BOLD);
  textSize(10);

  text(
    "SIZE = NUMBER OF REGISTRATIONS",
    60,
    height - 38
  );

  fill(100);
  textAlign(RIGHT);
  textStyle(NORMAL);

  text(
    "SOURCE: KBA · 2025",
    width - 60,
    height - 38
  );
}


// adatta la pagna
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
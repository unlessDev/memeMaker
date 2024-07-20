const imageFileInput = document.querySelector("#imageFileInput");
const canvas = document.querySelector("#meme");
const topTextInput = document.querySelector("#topTextInput");
const bottomTextInput = document.querySelector("#bottomTextInput");
const downloadButton = document.querySelector("#downloadButton");
const deleteButton = document.querySelector("#deleteButton");

let image;

imageFileInput.addEventListener("change", (e) => {
  const imageDataUrl = URL.createObjectURL(e.target.files[0]);

  image = new Image();
  image.src = imageDataUrl;

  image.addEventListener(
    "load",
    () => {
      updateMemeCanvas(
        canvas,
        image,
        topTextInput.value,
        bottomTextInput.value
      );
      toggleButtons(true);
    },
    { once: true }
  );
});

topTextInput.addEventListener("input", () => {
  updateMemeCanvas(canvas, image, topTextInput.value, bottomTextInput.value);
});

bottomTextInput.addEventListener("input", () => {
  updateMemeCanvas(canvas, image, topTextInput.value, bottomTextInput.value);
});

downloadButton.addEventListener("click", () => {
  descargarImagen();
});

deleteButton.addEventListener("click", () => {
  borrarImagen();
});

function updateMemeCanvas(canvas, image, topText, bottomText) {
  const ctx = canvas.getContext("2d");
  const width = image.width;
  const height = image.height;
  let fontSize = Math.floor(width / 12);
  const yOffset = height / 25;

  // Update canvas background
  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(image, 0, 0);

  // Prepare text
  ctx.strokeStyle = "black";
  ctx.lineWidth = Math.floor(fontSize / 6);
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.lineJoin = "round";

  // Function to wrap text
  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(" ");
    let line = "";
    let lines = [];

    for (let n = 0; n < words.length; n++) {
      let testLine = line + words[n] + " ";
      let metrics = ctx.measureText(testLine);
      let testWidth = metrics.width;

      if (testWidth > maxWidth && n > 0) {
        lines.push(line);
        line = words[n] + " ";
      } else {
        line = testLine;
      }
    }
    lines.push(line);

    for (let i = 0; i < lines.length; i++) {
      ctx.strokeText(lines[i], x, y + i * lineHeight);
      ctx.fillText(lines[i], x, y + i * lineHeight);
    }

    return lines.length * lineHeight;
  }

  // Adjust font size to fit the text
  function adjustFontSize(ctx, text, maxWidth, initialFontSize) {
    let fontSize = initialFontSize;
    ctx.font = `${fontSize}px sans-serif`;

    while (ctx.measureText(text).width > maxWidth && fontSize > 0) {
      fontSize--;
      ctx.font = `${fontSize}px sans-serif`;
    }

    return fontSize;
  }

  // Add top text
  ctx.textBaseline = "top";
  fontSize = adjustFontSize(ctx, topText, width - 20, fontSize);
  ctx.font = `${fontSize}px sans-serif`;
  wrapText(ctx, topText, width / 2, yOffset, width - 20, fontSize + 5);

  // Add bottom text
  ctx.textBaseline = "bottom";
  fontSize = adjustFontSize(ctx, bottomText, width - 20, fontSize);
  ctx.font = `${fontSize}px sans-serif`;

  const lineHeight = fontSize + 5;
  const maxLines = Math.floor((height - 2 * yOffset) / lineHeight);

  // Wrap text and get lines
  const lines = wrapTextAndGetLines(
    ctx,
    bottomText,
    width / 2,
    height - yOffset,
    width - 20,
    lineHeight,
    maxLines
  );

  // Draw bottom text
  for (let i = 0; i < lines.length; i++) {
    const y = height - yOffset - (lines.length - 1 - i) * lineHeight;
    ctx.strokeText(lines[i], width / 2, y);
    ctx.fillText(lines[i], width / 2, y);
  }
}

function wrapTextAndGetLines(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
  const words = text.split(" ");
  let lines = [];
  let line = "";

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;

    if (testWidth > maxWidth && n > 0) {
      lines.push(line.trim());
      line = words[n] + " ";
      if (lines.length >= maxLines - 1) {
        break;
      }
    } else {
      line = testLine;
    }
  }
  lines.push(line.trim());

  if (lines.length > maxLines) {
    lines = lines.slice(0, maxLines);
    lines[maxLines - 1] += "...";
  }

  return lines;
}

function descargarImagen() {
  const link = document.createElement("a");
  link.download = "meme.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}

function borrarImagen() {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  toggleButtons(false);
  window.location.reload();
}

function toggleButtons(show) {
  downloadButton.style.display = show ? "inline-block" : "none";
  deleteButton.style.display = show ? "inline-block" : "none";
}

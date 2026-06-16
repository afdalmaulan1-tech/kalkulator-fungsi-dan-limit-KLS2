// Fungsi helper untuk render KaTeX
function renderKaTeX(element, latex) {
  try {
    katex.render(latex, element, {
      throwOnError: false,
      displayMode: true
    });
  } catch (error) {
    console.error('Error rendering LaTeX:', error);
    element.innerText = latex;
  }
}

function pilihFungsi(jenis, tombol) {

  document.getElementById('jenisFungsi').value = jenis;

  document
    .querySelectorAll('.fungsi-btn')
    .forEach(btn => btn.classList.remove('active'));

  tombol.classList.add('active');

  updateInput();
}

function updateInput() {

  ['linear', 'kuadrat', 'eksponensial'].forEach(id => {
    document.getElementById(id).style.display = 'none';
  });

  const jenis =
    document.getElementById('jenisFungsi').value;

  document.getElementById(jenis).style.display = 'block';

  tampilkanRumus();
}

function getLatexRumus() {
  const jenis = document.getElementById('jenisFungsi').value;
  let latex = '';

  if (jenis === 'linear') {
    const a = document.getElementById('a1').value || 'a';
    const b = document.getElementById('b1').value || 'b';
    latex = 'f(x) = ' + a + 'x + ' + b;
  } else if (jenis === 'kuadrat') {
    const a = document.getElementById('a2').value || 'a';
    const b = document.getElementById('b2').value || 'b';
    const c = document.getElementById('c2').value || 'c';
    latex = 'f(x) = ' + a + 'x^{2} + ' + b + 'x + ' + c;
  } else if (jenis === 'eksponensial') {
    const a = document.getElementById('a3').value || 'a';
    latex = 'f(x) = ' + a + '^{x}';
  } 

  return latex;
}

function tampilkanRumus() {
  const latex = getLatexRumus();

  renderKaTeX(
    document.getElementById('rumusFungsi'),
    latex
  );

  const rumusLimit = document.getElementById('rumusLimit');

  if (rumusLimit) {
    renderKaTeX(rumusLimit, latex);
  }
}

function getFungsi() {
  const jenis = document.getElementById('jenisFungsi').value;

  
  if (jenis === 'linear') {
    const a = document.getElementById('a1').value;
    const b = document.getElementById('b1').value;
    return a + '*x+' + b;
  }
  
  if (jenis === 'kuadrat') {
    const a = document.getElementById('a2').value;
    const b = document.getElementById('b2').value;
    const c = document.getElementById('c2').value;
    return a + '*x^2+' + b + '*x+' + c;
  }
  
  if (jenis === 'eksponensial') {
    const a = document.getElementById('a3').value;
    return a + '^x';
  }
}

function hitungNilai() {
  try {
    const expr = getFungsi();
    const x = parseFloat(document.getElementById('nilaiX').value);

    if (isNaN(x)) {
      throw new Error('Nilai x harus berupa angka');
    }

    const hasil = math.evaluate(expr, { x: x });
    const hasilFx = document.getElementById('hasilFx');
    hasilFx.style.display = 'block';

    const resultText = document.createElement('div');
    resultText.innerHTML = '<b>Hasil:</b><br>';
    const latexDiv = document.createElement('div');
    latexDiv.style.marginTop = '10px';
    
    hasilFx.innerHTML = '';
    hasilFx.appendChild(resultText);
    hasilFx.appendChild(latexDiv);

    const latex_result = 'f(' + x + ') = ' + parseFloat(hasil.toFixed(4));
    renderKaTeX(latexDiv, latex_result);
  } catch (error) {
    const hasilFx = document.getElementById('hasilFx');
    hasilFx.style.display = 'block';
    hasilFx.innerHTML = '<span style="color: #e11d48;">Error: ' + error.message + '</span>';
  }
}

function hitungLaju() {
  try {
    const expr = getFungsi();
    const x1 = parseFloat(document.getElementById('x1').value);
    const x2 = parseFloat(document.getElementById('x2').value);

    if (isNaN(x1) || isNaN(x2)) {
      throw new Error('Nilai x1 dan x2 harus berupa angka');
    }

    if (x1 === x2) {
      throw new Error('Nilai x1 dan x2 harus berbeda');
    }

    const f1 = math.evaluate(expr, { x: x1 });
    const f2 = math.evaluate(expr, { x: x2 });
    const laju = (f2 - f1) / (x2 - x1);
    const lajuFixed = parseFloat(laju.toFixed(4));

    const hasilLaju = document.getElementById('hasilLaju');
    hasilLaju.style.display = 'block';

    const f1Fixed = parseFloat(f1.toFixed(4));
    const f2Fixed = parseFloat(f2.toFixed(4));

    const rumusLatex = 'm = \\frac{f(x_2) - f(x_1)}{x_2 - x_1} = \\frac{' + f2Fixed + ' - ' + f1Fixed + '}{' + x2 + ' - ' + x1 + '} = ' + lajuFixed;

    hasilLaju.innerHTML = '<div><b>Rumus Laju Perubahan:</b></div>';
    const latexDiv = document.createElement('div');
    latexDiv.style.marginTop = '10px';
    hasilLaju.appendChild(latexDiv);

    renderKaTeX(latexDiv, rumusLatex);
  } catch (error) {
    const hasilLaju = document.getElementById('hasilLaju');
    hasilLaju.style.display = 'block';
    hasilLaju.innerHTML = '<span style="color: #e11d48;">Error: ' + error.message + '</span>';
  }
}

function tampilkanVisualLimit(a, expr) {

const titik = [
  a - 0.1,
  a - 0.01,
  a - 0.001,

  a,

  a + 0.001,
  a + 0.01,
  a + 0.1
];

  const visual = document.getElementById('visualLimit');

  let html = `
    <div class="limit-title">
      Visualisasi Pendekatan Limit x → ${a}
    </div>

    <div class="number-line">
      <div class="line"></div>
  `;
const posisi = [
  10,
  25,
  40,

  50,

  60,
  75,
  90
];

  titik.forEach((x, i) => {

    let fx = "?";

    if (i !== 3) {
      try {
        fx = math.evaluate(expr, { x: x }).toFixed(4);
      } catch {
        fx = "?";
      }
    }

    html += `
      <div class="point ${i===3 ? 'center-point' : ''}"
           style="left:${posisi[i]}%;">
           
        <div class="xvalue">${parseFloat(x.toFixed(3))}</div>
        <div class="tick"></div>
        <div class="fxvalue">${fx}</div>

      </div>
    `;
  });

  html += `
      </div>
    </div>
  `;

  visual.innerHTML = html;
  visual.style.display = 'block';
}

function hitungLimit() {
  try {
    let expr = getFungsi();
    
    // Logika Shortcut: Mengarahkan ketikan "2" menjadi "x^2"
    if (expr === "") {
      expr = getFungsi();
    } else if (expr === "2") {
      expr = "x^2";
    }

    const a = parseFloat(document.getElementById('nilaiLimit').value);

    if (isNaN(a)) {
      throw new Error('Nilai limit harus berupa angka');
    }

    const kiri = math.evaluate(expr, { x: a - 0.0001 });
    const kanan = math.evaluate(expr, { x: a + 0.0001 });

    let kesimpulan = '';
    let tipeLimit = '';

    if (!isFinite(kiri) || !isFinite(kanan)) {
      kesimpulan = 'Limit menuju tak hingga (∞).';
      tipeLimit = '∞';
    } else if (Math.abs(kiri - kanan) < 0.05) {
      kesimpulan = 'Limit ada dan fungsi kontinu.';
      tipeLimit = Math.abs(Math.round(kanan) - kanan) < 0.01 ? Math.round(kanan) : parseFloat(kanan.toFixed(2));
    } else {
      kesimpulan = 'Limit tidak ada (diskontinu).';
      tipeLimit = '\\text{tidak ada}';
    }

    const hasilLimit = document.getElementById('hasilLimit');
    hasilLimit.style.display = 'block';
    hasilLimit.innerHTML = '';

    const headerDiv = document.createElement('div');
    headerDiv.innerHTML = '<b>Analisis Limit:</b>';
    hasilLimit.appendChild(headerDiv);

    const labelKiri = document.createElement('div');
    labelKiri.style.marginTop = '15px';
    labelKiri.innerHTML = '<b>Limit dari kiri (x → ' + a + '⁻):</b>';
    hasilLimit.appendChild(labelKiri);

    const latexKiri = document.createElement('div');
    latexKiri.style.margin = '10px 0';
    hasilLimit.appendChild(latexKiri);
    renderKaTeX(latexKiri, '\\lim_{x \\to ' + a + '^-} f(x) = ' + parseFloat(kiri.toFixed(4)));

    const labelKanan = document.createElement('div');
    labelKanan.style.marginTop = '15px';
    labelKanan.innerHTML = '<b>Limit dari kanan (x → ' + a + '⁺):</b>';
    hasilLimit.appendChild(labelKanan);

    const latexANAN = document.createElement('div');
    latexANAN.style.margin = '10px 0';
    hasilLimit.appendChild(latexANAN);
    renderKaTeX(latexANAN, '\\lim_{x \\to ' + a + '^+} f(x) = ' + parseFloat(kanan.toFixed(4)));

    const labelKesimpulan = document.createElement('div');
    labelKesimpulan.style.marginTop = '15px';
    labelKesimpulan.innerHTML = '<b>Kesimpulan:</b> ' + kesimpulan;
    hasilLimit.appendChild(labelKesimpulan);

    const labelHasil = document.createElement('div');
    labelHasil.style.marginTop = '10px';
    labelHasil.innerHTML = '<b>Nilai Limit:</b>';
    hasilLimit.appendChild(labelHasil);

    const latexHasil = document.createElement('div');
    latexHasil.style.margin = '10px 0';
    hasilLimit.appendChild(latexHasil);
    renderKaTeX(latexHasil, '\\lim_{x \\to ' + a + '} f(x) = ' + tipeLimit);
    tampilkanVisualLimit(a, expr);

  } catch (error) {
    const hasilLimit = document.getElementById('hasilLimit');
    hasilLimit.style.display = 'block';
    hasilLimit.innerHTML = '<span style="color: #e11d48;">❌ Error: ' + error.message + '</span>';
  }
}

document.addEventListener('DOMContentLoaded', function() {
  updateInput();
});
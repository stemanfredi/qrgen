document.getElementById('contentInput').addEventListener('input', function () {
  const generateButton = document.getElementById('generateButton')
  const qrCodeDiv = document.getElementById('qrcode')
  generateButton.style.display = 'block'
  qrCodeDiv.innerHTML = ''
})

function generateQRCode() {
  const content = document.getElementById('contentInput').value
  const qrcodeDiv = document.getElementById('qrcode')
  const generateButton = document.getElementById('generateButton')

  if (content.trim() === '') {
    alert('Please enter some content.')
    return
  }

  QRCode.toString(
    content,
    {
      type: 'svg',
      errorCorrectionLevel: 'L',
      width: 256,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    },
    function (error, svgString) {
      if (error) throw error
      qrcodeDiv.innerHTML = svgString
    }
  )

  generateButton.style.display = 'none'
}

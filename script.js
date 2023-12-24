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

document.getElementById('qrcode').addEventListener(
  'contextmenu',
  function (event) {
    event.preventDefault()
    const contextMenu = document.getElementById('contextMenu')
    contextMenu.style.display = 'block'
    contextMenu.style.left = `${event.pageX}px`
    contextMenu.style.top = `${event.pageY}px`
    return false // to prevent the default context menu
  },
  false
)

// Hide context menu when clicking elsewhere
window.addEventListener('click', function () {
  document.getElementById('contextMenu').style.display = 'none'
})

const saveAsSVG = () => {
  const svgElement = document.querySelector('#qrcode svg')
  if (!svgElement) {
    alert('No QR Code found to save.')
    return
  }

  const serializer = new XMLSerializer()
  const svgString = serializer.serializeToString(svgElement)
  const blob = new Blob([svgString], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)

  const downloadLink = document.createElement('a')
  downloadLink.href = url
  downloadLink.download = 'qrcode.svg'
  document.body.appendChild(downloadLink)
  downloadLink.click()
  document.body.removeChild(downloadLink)
}

const saveAsPDF = () => {
  const svgElement = document.querySelector('#qrcode svg')
  if (!svgElement) {
    alert('No QR Code found to save.')
    return
  }

  // Convert SVG to Canvas
  const serializer = new XMLSerializer()
  const svgString = serializer.serializeToString(svgElement)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const DOMURL = window.URL || window.webkitURL || window
  const img = new Image()
  const svg = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
  const url = DOMURL.createObjectURL(svg)

  img.onload = () => {
    canvas.width = img.width
    canvas.height = img.height
    ctx.drawImage(img, 0, 0)
    const imageData = canvas.toDataURL('image/png')

    // Create PDF and add the image
    const pdf = new jspdf.jsPDF({
      orientation: 'landscape',
      unit: 'pt',
      format: [canvas.width, canvas.height],
    })

    pdf.addImage(imageData, 'PNG', 0, 0, canvas.width, canvas.height)
    pdf.save('qrcode.pdf')

    DOMURL.revokeObjectURL(url)
  }

  img.src = url
}

const saveAsPNG = () => {
  const svgElement = document.querySelector('#qrcode svg')
  if (!svgElement) {
    alert('No QR Code found to save.')
    return
  }

  // Define your desired DPI
  const dpi = 300
  const scaleFactor = dpi / 96 // 96 is the standard screen DPI

  const serializer = new XMLSerializer()
  const svgString = serializer.serializeToString(svgElement)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const DOMURL = window.URL || window.webkitURL || window
  const img = new Image()
  const svg = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
  const url = DOMURL.createObjectURL(svg)

  img.onload = () => {
    canvas.width = img.width * scaleFactor // Scale canvas width
    canvas.height = img.height * scaleFactor // Scale canvas height
    ctx.scale(scaleFactor, scaleFactor) // Scale drawing context
    ctx.drawImage(img, 0, 0)
    DOMURL.revokeObjectURL(url)

    const downloadLink = document.createElement('a')
    downloadLink.href = canvas.toDataURL('image/png')
    downloadLink.download = 'qrcode.png'
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
  }

  img.src = url
}

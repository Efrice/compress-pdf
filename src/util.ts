import * as pdf from 'pdfjs-dist'
import pdfWorker from 'pdfjs-dist/build/pdf.worker.js?url'
import { saveAs } from 'file-saver'
import { imgData } from '~/types'

pdf.GlobalWorkerOptions.workerSrc = pdfWorker;

const imgData: imgData[] = []

export async function loadPdf(url: string, range: number, compressing: Ref<boolean>) {
  const loadingTask = pdf.getDocument({
    url,
    disableRange: true
  });

  imgData.length = 0
 
  loadingTask.promise.then((pdfDoc) => {
    const totalPages = pdfDoc.numPages;
    for (let i = 1; i <= totalPages; i++) {
      pdfDoc.getPage(i).then((page) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        const viewport = page.getViewport({ scale: 1 });

        canvas.width = viewport.width
        canvas.height = viewport.height

        const renderContext = {
          canvasContext: ctx,
          viewport,
        }
        
        const renderTask = page.render(renderContext);

        renderTask.promise.then(function () {
          imgData.push({src: canvas.toDataURL("image/jpeg", +range), width: canvas.width, height: canvas.height})
          if(imgData.length === totalPages){
            img2Pdf(compressing)
          }
        })
      })
    }
  })
}

function img2Pdf(compressing: Ref<boolean>) {
  const options = {
    autoFirstPage: false,
    compress: false
  };

  const doc = new PDFDocument(options);

  const stream = doc.pipe(blobStream());

    for (let i = 0; i < imgData.length; i++) {
      const {src, width, height} = imgData[i]
      doc.addPage({
        size: [width, height],
      });
      doc.image(src, 0, 0);
  }

  doc.end();

  stream.on("finish", function () {
    var output_blob = stream.toBlob("application/pdf");
    saveAs(output_blob, 'download.pdf');
    compressing.value = false
  });
}

import React, { useRef } from 'react';
import ClassSchedule from './ClassSchedule';
import { CartButton } from '@thoughtindustries/cart';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import ingramLogo from '../../renderer/ingramLogo.png';

interface TabData {
  label: string;
  body: string | null;
}

const Tabs = ({ data, courseId }: { data: TabData[]; courseId: string }) => {
  const [openTab, setOpenTab] = React.useState(1);

  const printRef = useRef(null);

  const handleDownloadPdf = async () => {
    const element = printRef.current;
    if (element) {
      const canvas = await html2canvas(element, {
        onclone: function (clonedDoc) {
          if (clonedDoc) {
            clonedDoc.getElementById('pdf').style.display = 'block';
          }
        },
      });
      const data = canvas.toDataURL('image/png');

      const pdf = new jsPDF();
      const imgProperties = pdf.getImageProperties(data);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

      pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('document.pdf');
    }
  };

  return (
    <>
      <div className="flex justify-end items-center">
        <CartButton />
      </div>
      <div className="flex flex-wrap">
        <div className="w-full">
          <ul
            className="flex mb-0 list-none flex-wrap pt-3 pb-0 flex-row border-black border-b"
            role="tablist"
          >
            {data.map((tab, idx) => (
              <li key={tab.label} className=" mr-1 last:mr-0 text-center">
                <a
                  className={
                    'text-sm px-2 py-3 block leading-normal border-1 border-white ' +
                    (openTab === idx + 1
                      ? 'text-white bg-accent border-accent'
                      : 'text-primary bg-tertiary')
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenTab(idx + 1);
                  }}
                  data-toggle="tab"
                  href={`link${idx + 1}`}
                  role="tablist"
                >
                  {tab.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6">
            <div className="px-4 py-5 flex-auto">
              <div className="tab-content tab-space">
                {data.map((tab, idx) => (
                  <div
                    key={tab.label}
                    className={openTab === idx + 1 ? 'block' : 'hidden'}
                    id={`link${idx + 1}`}
                  >
                    {tab.body ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: tab.body,
                        }}
                      />
                    ) : (
                      <ClassSchedule courseId={courseId} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-start px-4">
            <button
              className="py-2 px-5 bg-accent border-accent text-accent-contrast"
              type="button"
              onClick={handleDownloadPdf}
            >
              Download as PDF
            </button>
          </div>
          <div id="pdf" className="hidden mb-4 pb-4" ref={printRef}>
            <div className="flex items-center justify-end">
              <img src={ingramLogo} className="h-11" />
            </div>
            <ClassSchedule courseId={courseId} />
            <div className="px-4">
              {data[1].body && (
                <div
                  dangerouslySetInnerHTML={{
                    __html: data[1].body,
                  }}
                  className="py-4"
                />
              )}
              {data[2].body && (
                <div
                  dangerouslySetInnerHTML={{
                    __html: data[2].body,
                  }}
                  className="py-4"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Tabs;

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

const CourseTabs = ({
    tabs,
    courseId,
    currencyCode,
}: {
    tabs: TabData[];
    courseId: string;
    currencyCode: string;
}) => {
    const [openTab, setOpenTab] = React.useState(1);

    const printRef = useRef(null);

    const handleDownloadPdf = async () => {
        const element = printRef.current;
        if (element) {
            const canvas = await html2canvas(element, {
                onclone: function (clonedDoc) {
                    if (clonedDoc) {
                        const pdfElement = clonedDoc.getElementById('pdf');
                        if (pdfElement) {
                            pdfElement.style.display = 'block';
                        }
                    }
                },
            });
            const imgWidth = 210;
            const pageHeight = 290;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            const pageData = canvas.toDataURL('image/jpeg', 1.0);
            const imgData = encodeURIComponent(pageData);
            const doc = new jsPDF('p', 'mm');
            let position = 0;
            doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            doc.setLineWidth(5);
            doc.setDrawColor(255, 255, 255);
            doc.rect(0, 0, 210, 295);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                doc.addPage();
                doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                doc.setLineWidth(5);
                doc.setDrawColor(255, 255, 255);
                doc.rect(0, 0, 210, 295);
                heightLeft -= pageHeight;
            }
            doc.save('file.pdf');
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
                        {tabs.map((tab, idx) => (
                            <li
                                key={tab.label}
                                className="mr-1 last:mr-0 text-center"
                            >
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
                                    href={`link${idx + 1}`}
                                >
                                    {tab.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6">
                        <div className="px-4 py-5 flex-auto">
                            <div className="course-tab-content course-tab-space">
                                {tabs.map((tab, idx) => (
                                    <div
                                        key={tab.label}
                                        className={
                                            openTab === idx + 1
                                                ? 'block'
                                                : 'hidden'
                                        }
                                        id={`course-tab-content-${idx + 1}`}
                                    >
                                        {tab.body ? (
                                            <>
                                                <div
                                                    dangerouslySetInnerHTML={{
                                                        __html: tab.body,
                                                    }}
                                                />
                                                <div className="flex justify-start px-0 py-4">
                                                    <button
                                                        className="py-2 px-5 bg-accent border-accent text-accent-contrast"
                                                        type="button"
                                                        onClick={
                                                            handleDownloadPdf
                                                        }
                                                    >
                                                        Download as PDF
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <ClassSchedule
                                                courseId={courseId}
                                                currencyCode={currencyCode}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div id="pdf" className="hidden mb-4 pb-4" ref={printRef}>
                        <div className="flex items-center justify-end">
                            <img src={ingramLogo} className="h-11" />
                        </div>
                        <ClassSchedule
                            courseId={courseId}
                            currencyCode={currencyCode}
                        />
                        <div className="px-4">
                            {tabs[1].body && (
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: tabs[1].body,
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

export default CourseTabs;

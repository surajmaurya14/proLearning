import { useState, useEffect, useRef } from "react";
import Template from "../../components/Certificate/certificateTemplate";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import axios from "axios";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { format } from "date-fns";

const Certificate = () => {
    const router = useRouter();
    const inputRef = useRef(null);
    const [certificate, setCertificate] = useState(null);
    const [loading, setLoading] = useState(false);
    const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [297, 210],
    });
    useEffect(() => {
        const fetchCertficateData = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get(
                    `/api/certificate/${router.query.id}`
                );
                if (data.success === true) {
                    setCertificate(data.certificate);
                    setLoading(false);
                } else {
                    toast.warning("Couldn't fetch certificate data");
                    setLoading(false);
                    return;
                }
            } catch (err) {
                // console.error(`Error: ${err}`);
                toast.error("Error");
                return;
            }
        };
        if (router.query.id) fetchCertficateData();
    }, [router.query.id]);

    useEffect(() => {
        if (inputRef.current) {
            html2canvas(inputRef.current).then((canvas) => {
                const imgData = canvas.toDataURL("image/png");
                pdf.addImage(imgData, "JPEG", 0, 0, 297, 210);
            });
        }
    });

    const Print = () => {
        pdf.save("download.pdf");
    };

    return (
        <>
            {loading ? (
                <svg
                    className="animate-spin text-black h-24 w-24 mx-auto mt-8"
                    // xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    width={100}
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    ></circle>
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                </svg>
            ) : (
                <>
                    {certificate && (
                        <div className="flex flex-col justify-center font-serif p-8 w-full">
                            <div className="h-full rounded-md w-full overflow-auto">
                                <Template
                                    name={
                                        certificate.user &&
                                        certificate.user.first_name +
                                            " " +
                                            certificate.user.last_name
                                    }
                                    courseName={
                                        certificate.course &&
                                        certificate.course.title
                                    }
                                    instructorName={
                                        certificate.course &&
                                        certificate.course.instructor &&
                                        certificate.course.instructor
                                            .first_name +
                                            " " +
                                            certificate.course.instructor
                                                .last_name
                                    }
                                    certificateId={certificate._id}
                                    creationDate={format(
                                        new Date(certificate.createdAt),
                                        "d MMM, hh:mm a"
                                    )}
                                    inputRef={inputRef}
                                />
                            </div>
                            <button
                                className="w-fit px-4 py-2 mt-4 bg-brand-dark hover:bg-brand-super_dark text-white font-bold rounded-md"
                                onClick={Print}
                                type="button"
                            >
                                Download
                            </button>
                        </div>
                    )}
                </>
            )}
        </>
    );
};

export default Certificate;

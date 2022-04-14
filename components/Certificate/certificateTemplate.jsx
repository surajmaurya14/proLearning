const Template = ({
    name,
    courseName,
    instructorName,
    certificateId,
    creationDate,
    inputRef,
}) => {
    return (
        <div
            id="print"
            ref={inputRef}
            className="bg-gradient-to-r from-brand-bg_light to-brand-super_light border-brand-super_dark border-4 font-mono h-[210mm] w-[297mm] text-center flex flex-col space-y-16 py-8"
        >
            <div className="flex flex-row justify-center items-center">
                <img
                    src="/logo.svg"
                    alt="proLearing"
                    className="w-[100px] h-[100px]"
                />
                <h1 className="text-6xl ml-4 font-extrabold text-brand-super_dark">
                    proLearning
                </h1>
            </div>
            <p className="font-bold text-6xl">CERTIFICATE OF COMPLETION</p>
            <p className="text-2xl">This certificate is hereby awarded to</p>
            <p className="font-bold text-4xl">{name}</p>
            <div className="mt-4">
                <p className="m-2 text-lg">
                    For successfully completing the{" "}
                    <span className="font-semibold">{courseName}</span> by{" "}
                    <span className="font-semibold">{instructorName}</span>
                </p>
                <p className="m-2 text-lg">
                    Issued on {creationDate} by{" "}
                    <span className="text-brand-super_dark">proLearning</span>
                </p>
                <p className="mt-8 text-lg">
                    Certificate ID:{" "}
                    <span className="text-brand-super_dark">
                        {certificateId}
                    </span>
                </p>
                <p className="mt-8 text-lg">
                    Verification Link{" "}
                    <a
                        className="mt-8 text-sm text-brand-super_dark"
                        href={`${process.env.NEXT_PUBLIC_DOMAIN}/certificate/${certificateId}`}
                        target="_blank"
                        rel="noreferrer"
                    >
                        {`${process.env.NEXT_PUBLIC_DOMAIN}/certificate/${certificateId}`}
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Template;

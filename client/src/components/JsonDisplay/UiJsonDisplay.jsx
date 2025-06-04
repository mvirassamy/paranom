import { useState } from 'react';

const UiJsonDisplay = ({ jsonData }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    const renderData = (data) => {
        if (Array.isArray(data)) {
            return (
                <ul className="list-disc ml-5">
                    {data.map((item, index) => (
                        <li key={index}>{renderData(item)}</li>
                    ))}
                </ul>
            );
        } else if (typeof data === 'object') {
            return (
                <div className="ml-2">
                    {Object.keys(data).map((key) => (
                        <div key={key}>
                            <strong>{key}:</strong> {renderData(data[key])}
                        </div>
                    ))}
                </div>
            );
        } else {
            return <span>{data.toString()}</span>;
        }
    };

    return (
        <div className="container mx-auto p-4">
            <button
                onClick={toggleOpen}
            >
                {isOpen ? '▼' : '▶ JSON'}
            </button>

            {isOpen && renderData(jsonData)}
        </div>
    );
};

export default UiJsonDisplay;

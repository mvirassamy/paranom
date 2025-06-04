import {UiCard} from "../Card/UiCard.jsx";

export const UiStepper = ({data = []}) => {
    data.forEach((item) => {
        if (!item.className)
            item.className = "col-span-full";
    });

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {data.map((item, id) => (
                    <UiCard key={id} title={item.title} description={item.description} tag={item.tag} image={item.img} className={item.className} />
                ))}
            </div>
        </div>
    )
}
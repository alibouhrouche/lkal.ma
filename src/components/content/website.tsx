import {ComponentShape} from "@/components/tools";

export default function WebsiteContent({ shape }: { shape: ComponentShape }) {
    return (
        <div className="w-full h-full p-2 overflow-x-hidden">
            <iframe
                srcDoc={String(shape.props.value)}
                className="w-full h-full border-none rounded-md"
                sandbox="allow-scripts allow-modals allow-forms"
            />
        </div>
    );
}

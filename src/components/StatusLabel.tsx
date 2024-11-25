interface IStatusLabel {
    isPrimary: boolean,
    primaryText: string,
    secondText: string;
}

const StatusLabel = ( {isPrimary, primaryText, secondText}: IStatusLabel) => {
    return (
        <span
            className={`px-2 py-1 rounded ${isPrimary ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                }`}
        >
            {isPrimary ? primaryText : secondText}
        </span>
    )
}

export { StatusLabel }
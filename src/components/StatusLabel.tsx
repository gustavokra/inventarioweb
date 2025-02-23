interface IStatusLabel {
    isPrimary: boolean,
    primaryText: string,
    secondText: string;
}

const StatusLabel = ({ isPrimary, primaryText, secondText }: IStatusLabel) => {
    return (
        <span
            className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-medium ${
                isPrimary 
                ? 'bg-[var(--color-primary-bg)] text-[var(--color-primary-dark)]' 
                : 'bg-orange-50 text-orange-700'
            } transition-colors`}
        >
            {isPrimary ? primaryText : secondText}
        </span>
    )
}

export { StatusLabel }
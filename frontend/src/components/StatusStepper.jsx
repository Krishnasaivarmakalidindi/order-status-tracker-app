const STATUS_FLOW = ["Placed", "Packed", "Shipped", "Delivered"];

function StatusStepper({ status }) {
    const currentIndex = STATUS_FLOW.indexOf(status);

    return (
        <div className="stepper" aria-label="Order progress">
            {STATUS_FLOW.map((step, index) => {
                const className =
                    index < currentIndex
                        ? "step-dot completed"
                        : index === currentIndex
                            ? "step-dot current"
                            : "step-dot upcoming";

                return (
                    <div key={step} className="step-node">
                        <span className={className}>{step}</span>
                        {index < STATUS_FLOW.length - 1 && <span className="step-line" />}
                    </div>
                );
            })}
        </div>
    );
}

export { STATUS_FLOW };
export default StatusStepper;

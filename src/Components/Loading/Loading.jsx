import './Loading.css';

const Loading = ({ fullPage = false, type = 'default' }) => {

    if (fullPage) {
        return (
            <div className="skeleton-container full-page">
                <div className="skeleton-line"></div>
                <div className="skeleton-line"></div>
                <div className="skeleton-line"></div>
                <div className="skeleton-line"></div>
            </div>
        );
    }

    if (type === 'card') {
        return (
            <div className="skeleton-cards">
                {[...Array(4)].map((_, i) => (
                    <div className="skeleton-card" key={i}>
                        <div className="skeleton-card-title skeleton-bg" />
                        <div className="skeleton-card-icon skeleton-bg" />
                        <div className="skeleton-card-value skeleton-bg" />
                    </div>
                ))}
            </div>
        );
    }

    if (type === 'table') {
        return (
            <div className="skeleton-table">
                <div className="skeleton-table-header">
                    {[...Array(5)].map((_, i) => (
                        <div className="skeleton-table-header-cell skeleton-bg" key={i} />
                    ))}
                </div>
                {[...Array(5)].map((_, i) => (
                    <div className="skeleton-table-row" key={i}>
                        {[...Array(5)].map((_, j) => (
                            <div className="skeleton-table-cell skeleton-bg" key={j} />
                        ))}
                    </div>
                ))}
            </div>
        );
    }

    if (type === 'detail') {
        return (
            <div className="skeleton-detail">
                <div className="skeleton-detail-images">
                    {[...Array(3)].map((_, i) => (
                        <div className="skeleton-detail-image skeleton-bg" key={i} />
                    ))}
                </div>
                {[...Array(8)].map((_, i) => (
                    <div className="skeleton-detail-row" key={i}>
                        <div className="skeleton-detail-label skeleton-bg" />
                        <div className="skeleton-detail-value skeleton-bg" />
                    </div>
                ))}
            </div>
        );
    }

    if (type === 'editor') {
        return (
            <div className="skeleton-editor">
                <div className="skeleton-editor-toolbar">
                    {[...Array(3)].map((_, i) => (
                        <div className="skeleton-editor-btn skeleton-bg" key={`a${i}`} />
                    ))}
                    <div className="skeleton-editor-divider" />
                    {[...Array(3)].map((_, i) => (
                        <div className="skeleton-editor-btn skeleton-bg" key={`b${i}`} />
                    ))}
                    <div className="skeleton-editor-divider" />
                    {[...Array(2)].map((_, i) => (
                        <div className="skeleton-editor-btn skeleton-bg" key={`c${i}`} />
                    ))}
                </div>
                <div className="skeleton-editor-body">
                    {[...Array(4)].map((_, i) => (
                        <div className="skeleton-editor-line skeleton-bg" key={`p1-${i}`} />
                    ))}
                    <div className="skeleton-editor-gap" />
                    {[...Array(3)].map((_, i) => (
                        <div className="skeleton-editor-line skeleton-bg" key={`p2-${i}`} />
                    ))}
                    <div className="skeleton-editor-gap" />
                    {[...Array(2)].map((_, i) => (
                        <div className="skeleton-editor-line skeleton-bg" key={`p3-${i}`} />
                    ))}
                </div>
            </div>
        );
    }

    if (type === 'dashboard') {
        return (
            <div className="skeleton-dashboard">
                <div className="skeleton-dashboard-stats">
                    {[...Array(4)].map((_, i) => (
                        <div className="skeleton-dashboard-stat" key={i}>
                            <div className="skeleton-dashboard-stat-label skeleton-bg" />
                            <div className="skeleton-dashboard-stat-value skeleton-bg" />
                        </div>
                    ))}
                </div>
                <div className="skeleton-dashboard-charts">
                    <div className="skeleton-dashboard-chart">
                        <div className="skeleton-dashboard-chart-title skeleton-bg" />
                        <div className="skeleton-dashboard-chart-bars">
                            {[40, 65, 50, 80, 35, 70, 55].map((h, i) => (
                                <div
                                    className="skeleton-dashboard-chart-vbar skeleton-bg"
                                    key={i}
                                    style={{ height: `${h}%` }}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="skeleton-dashboard-chart">
                        <div className="skeleton-dashboard-chart-title skeleton-bg" />
                        <div className="skeleton-dashboard-chart-circle skeleton-bg" />
                    </div>
                </div>
            </div>
        );
    }

    if (type === 'form') {
        return (
            <div className="skeleton-form">
                {[...Array(6)].map((_, i) => (
                    <div className="skeleton-form-group" key={i}>
                        <div className="skeleton-form-number skeleton-bg" />
                        <div className="skeleton-form-label skeleton-bg" />
                        <div className="skeleton-form-input skeleton-bg" />
                    </div>
                ))}
            </div>
        );
    }

    if (type === 'chat') {
        return (
            <div className="skeleton-chat">
                {[...Array(5)].map((_, i) => (
                    <div className={`skeleton-chat-bubble ${i % 2 === 0 ? '' : 'right'}`} key={i}>
                        <div className="skeleton-chat-avatar skeleton-bg" />
                        <div className="skeleton-chat-content">
                            <div className="skeleton-chat-msg skeleton-bg" />
                            <div className="skeleton-chat-time skeleton-bg" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (type === 'list') {
        return (
            <div className="skeleton-list">
                {[...Array(6)].map((_, i) => (
                    <div className="skeleton-list-item" key={i}>
                        <div className="skeleton-list-avatars">
                            <div className="skeleton-list-avatar skeleton-bg" />
                            <div className="skeleton-list-avatar-overlap skeleton-bg" />
                        </div>
                        <div className="skeleton-list-info">
                            <div className="skeleton-list-name skeleton-bg" />
                            <div className="skeleton-list-preview skeleton-bg" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    // Default
    return (
        <div className="skeleton-container">
            <div className="skeleton-line"></div>
            <div className="skeleton-line"></div>
            <div className="skeleton-line"></div>
            <div className="skeleton-line"></div>
        </div>
    );
};

export default Loading;

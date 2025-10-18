import React from 'react';
import PageLayout from '../layouts/PageLayout';

export default function InviteFriends() {
    return (
        <PageLayout title="Invite Friends">
            <div className="card shadow-sm">
                <div className="card-body text-center py-5">
                    <i className="bi-people text-muted" style={{fontSize: '3rem'}}></i>
                    <h5 className="mt-3 mb-2">Invite Friends</h5>
                    <p className="text-muted">Invite Friends functionality coming soon...</p>
                </div>
            </div>
        </PageLayout>
    );
}
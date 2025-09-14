'use server';

import {signOut} from "@workos-inc/authkit-nextjs";

async function signOutAction() {
    try {
        return signOut()
    } catch (error) {
        console.error('Failed to sign out:', error);
    }
}

export {signOutAction};
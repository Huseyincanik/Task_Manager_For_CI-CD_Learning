import { waitFor } from '@testing-library/react';

/**
 * Wait for loading to complete
 */
export const waitForLoadingToFinish = () => {
    return waitFor(() => {
        const loadingElement = document.querySelector('.loading');
        expect(loadingElement).not.toBeInTheDocument();
    });
};

/**
 * Wait for element to appear
 */
export const waitForElement = async (getByText, text) => {
    return waitFor(() => {
        expect(getByText(text)).toBeInTheDocument();
    });
};

/**
 * Wait for element to disappear
 */
export const waitForElementToDisappear = async (queryByText, text) => {
    return waitFor(() => {
        expect(queryByText(text)).not.toBeInTheDocument();
    });
};

/**
 * Simulate async delay
 */
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Create mock API response
 */
export const createMockResponse = (data, success = true) => ({
    data: {
        success,
        data,
    },
});

/**
 * Create mock API error
 */
export const createMockError = (message, status = 500) => ({
    response: {
        status,
        data: {
            error: message,
        },
    },
    message,
});

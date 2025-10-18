import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import fetcher, { loadingStatus } from 'helpers/fetcher';
import { customer, raw } from 'constants/endpoints';

const postAuthCodeSend = async telephone => {
	const formData = new FormData();
	formData.append('telephone', telephone);
	const response = await fetcher(
		'/index.php?route=account/signin/auth-code-send',
		{
			method: 'POST',
			body: formData,
		}
	);
	return response.json();
};

const postAuthCodeValidate = async (telephone, code) => {
	const formData = new FormData();
	formData.append('telephone', telephone);
	formData.append('code', code);
	const response = await fetcher(
		'/index.php?route=account/signin/auth-code-validate',
		{
			method: 'POST',
			body: formData,
		}
	);
	return response.json();
};

const editProfile = async data => {
	const formData = new FormData();
	Object.keys(data).forEach(k => formData.append(k, data[k]));
	const response = await fetcher('/index.php?route=account/edit', {
		method: 'POST',
		body: formData,
	});
	return response.json();
};

const addToWishlist = async product_id => {
	const formData = new FormData();
	formData.append('product_id', product_id);
	const response = await fetcher(raw.WISHLIST_ADD, {
		method: 'POST',
		body: formData,
	});
	return response.json();
};

const deleteFromWishlist = async product_id => {
	const formData = new FormData();
	formData.append('product_id', product_id);
	const response = await fetcher(raw.WISHLIST_DELETE, {
		method: 'POST',
		body: formData,
	});
	return response.json();
};

const fetchProfile = createAsyncThunk('customer.profile', async () => {
	const response = await fetcher('/index.php?route=account/account');
	return response.json();
});

const fetchHistories = createAsyncThunk('customer.histories', async () => {
	const response = await fetcher('/index.php?route=account/order');
	return response.json();
});

const fetchHistory = createAsyncThunk('customer.history', async id => {
	const response = await fetcher(
		'/index.php?route=account/order/info&order_id=' + id
	);
	return response.json();
});

const fetchWishlist = createAsyncThunk('customer.wishlist', async () => {
	const response = await fetcher('/index.php?route=account/wishlist');
	return response.json();
});

const initialState = {
	profile: {
		data: {},
		status: loadingStatus.IDLE,
	},
	histories: {
		data: {},
		status: loadingStatus.IDLE,
	},
	history: {
		data: {},
		status: loadingStatus.IDLE,
	},
	wishlist: {
		data: {},
		status: loadingStatus.IDLE,
	},
};

const customerSlice = createSlice({
	name: 'customer',
	initialState,
	reducers: {},
	extraReducers(builder) {
		builder
			.addCase(fetchProfile.pending, (state, action) => {
				state.profile.status = loadingStatus.LOADING;
			})
			.addCase(fetchProfile.fulfilled, (state, action) => {
				state.profile.status = loadingStatus.SUCCEEDED;
				state.profile.data = action.payload;
			})
			.addCase(fetchHistories.pending, (state, action) => {
				state.histories.status = loadingStatus.LOADING;
			})
			.addCase(fetchHistories.fulfilled, (state, action) => {
				state.histories.status = loadingStatus.SUCCEEDED;
				state.histories.data = action.payload;
			})
			.addCase(fetchHistory.pending, (state, action) => {
				state.history.status = loadingStatus.LOADING;
			})
			.addCase(fetchHistory.fulfilled, (state, action) => {
				state.history.status = loadingStatus.SUCCEEDED;
				state.history.data = action.payload;
			})
			.addCase(fetchWishlist.pending, (state, action) => {
				state.wishlist.status = loadingStatus.LOADING;
			})
			.addCase(fetchWishlist.fulfilled, (state, action) => {
				state.wishlist.status = loadingStatus.SUCCEEDED;
				state.wishlist.data = action.payload;
			});
	},
});

export default customerSlice.reducer;

// export const { postAdded, postUpdated, reactionAdded } = playerSlice.actions;
export {
	postAuthCodeSend,
	postAuthCodeValidate,
	editProfile,
	addToWishlist,
	deleteFromWishlist,
	fetchProfile,
	fetchHistory,
	fetchHistories,
	fetchWishlist,
};

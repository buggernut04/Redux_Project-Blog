import { createSlice } from "@reduxjs/toolkit";
import { BlogState } from "../app/types";
import { PayloadAction } from "@reduxjs/toolkit";
import { Blog } from "../app/types";

const blogSlice = createSlice ({
    name: 'blogs',
    initialState: {
        blogs: [],
        selectedBlog: null,
        loading: false,
        error: null,
        searchQuery: '',
        selectedCategory: 'All',
        currentPage: 1,
    } as BlogState,
    reducers: {
        setBlogs: (state, action: PayloadAction<Blog[]>) => {
            state.blogs = action.payload;
            state.loading = false;
            state.error = null;
        },
        setSelectedBlog: (state, action: PayloadAction<Blog | null>) => {
            state.selectedBlog = action.payload;
        },
        addBlog: (state, action: PayloadAction<Blog>) => {
            state.blogs.unshift(action.payload);
        },
        updateBlog: (state, action: PayloadAction<Blog>) => {
            const index = state.blogs.findIndex(blog => blog.id === action.payload.id);
            if (index !== -1) {
                state.blogs[index] = action.payload;
            }
            if (state.selectedBlog && state.selectedBlog.id === action.payload.id) {
                state.selectedBlog = action.payload;
            }
        },
        deleteBlog: (state, action: PayloadAction<string>) => {
            state.blogs = state.blogs.filter(blog => blog.id !== action.payload);
            
            if (state.selectedBlog && state.selectedBlog.id === action.payload) {
                state.selectedBlog = null;
            }
        },
        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.searchQuery = action.payload;
            state.currentPage = 1;
        },
        setSelectedCategory: (state, action: PayloadAction<string>) => {
            state.selectedCategory = action.payload;
        },
        setCurrentPage: (state, action: PayloadAction<number>) => {
            state.currentPage = action.payload;
        },
        setBlogLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setBlogError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
            state.loading = false;
        },
        clearBlogError: (state) => {
            state.error = null;
        },
        clearBlogs: (state) => {
            state.blogs = [];
            state.selectedBlog = null;
            state.loading = false;
            state.error = null;
            state.searchQuery = '';
            state.selectedCategory = 'All';
            state.currentPage = 1;
        }
    }
});

export const {
    setBlogs,
    setSelectedBlog,
    addBlog,
    updateBlog,
    deleteBlog,
    setSearchQuery,
    setSelectedCategory,
    setCurrentPage,
    setBlogLoading,
    setBlogError,
    clearBlogError,
    clearBlogs
} = blogSlice.actions;

export const blogReducer = blogSlice.reducer;

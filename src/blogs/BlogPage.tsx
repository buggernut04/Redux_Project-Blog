import { JSX, useEffect, useState } from "react";
import { AppDispatch } from "../app/store";
import { logout, setError } from "../authentication/authSlice";
import { supabase } from "../supabase-client";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

import { RootState } from "../app/store";
import BlogHeader from "./components/BlogHeader";
import BlogPost from "./components/BlogPost";
import { addBlog, addComment, deleteComment, setBlogError, setCurrentPage, setSearchQuery, setSelectedBlog, setSelectedCategory, updateBlog, updateComment } from "./blogSlice";
import { deleteBlog, setBlogs, setBlogLoading } from "./blogSlice";
import { Blog, Comment } from "../app/types";
import CreateBlogForm from "./components/CreateBlogForm";
import { Toaster } from "../style/ui/sonner";
import CategoryFilter from "./components/CategoryFilter";
import Pagination from "./components/Pagination";
import BlogCard from "./components/BlogCard";
import DeleteConfirmDialog from "./components/DeleteConfirmDialog";
import CommentSection from "./components/CommentSection";

import { setComments } from "./blogSlice";

export default function BlogPage(): JSX.Element {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);
    const { 
        blogs, 
        comments,
        selectedBlog,
        loading: blogLoading,
        searchQuery,
        selectedCategory,
        currentPage
    } = useSelector((state: RootState) => state.blog);

    const [view, setView] = useState<'list' | 'detail' | 'create' | 'edit'>('list');
    const [blogToDelete, setBlogToDelete] = useState<string | null>(null);
    const [editingBlog, setEditingBlog] = useState<Blog | null>(null);

    const POSTS_PER_PAGE = 3;

    // All Functions for Blog CRUD Operations
    const fetchBlogs = async (): Promise<void> => {
        try {
            dispatch(setBlogLoading(true));
            const { data, error } = await supabase
                .from('blogs')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
        
            const formattedBlogs: Blog[] = (data || []).map(blog => ({
                ...blog,
                date: new Date(blog.created_at),
                tags: blog.tags || [],
            }));
            
            dispatch(setBlogs(formattedBlogs))

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch blogs';
            dispatch(setBlogError(errorMessage));
        } finally {
            dispatch(setBlogLoading(false));
        }
    };

    const handleCreateBlog = async (blogData: {
        title: string;
        excerpt: string;
        content: string;
        category: string;
        tags: string[];
        image: string | File;
    }): Promise<void> => {
        try {
            dispatch(setBlogLoading(true));

            const { data, error } = await supabase
            .from('blogs')
            .insert([
            {   
                ...blogData,
                author: user?.user_metadata.name,
                date: new Date(),
                author_id: user?.id,
            },
            ])
            .select()
            .single();

                if (error) throw error;
                
            const formattedBlog: Blog = {
                ...data,
                date: new Date(data.created_at),
            };
                
            dispatch(addBlog(formattedBlog));
            setView('list');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to create blog';
            dispatch(setBlogError(errorMessage));
        } finally {
            dispatch(setBlogLoading(false));
        }
    };

    const handleUpdateBlog = async (blogData: {
        title: string;
        excerpt: string;
        content: string;
        category: string;
        tags: string[];
        image: string;
    }): Promise<void> => {
        if (!editingBlog) return;

        try {
            dispatch(setBlogLoading(true));
           
            const { data, error } = await supabase
                .from('blogs')
                .update({
                    title: blogData.title,
                    excerpt: blogData.excerpt,
                    content: blogData.content,
                    category: blogData.category,
                    tags: blogData.tags,
                    image: blogData.image,
                    author: user?.user_metadata.name,
                    date: new Date(),
                    author_id: user?.id,
                })
                .eq('id', editingBlog.id)
                .select()
                .single();

            if (error) throw error;
            
            const formattedBlog: Blog = {
                ...data,
                date: new Date(data.created_at),
            };
            
            dispatch(updateBlog(formattedBlog));
            setEditingBlog(null);
            setView('list');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update blog';
            dispatch(setBlogError(errorMessage));
        } finally {
            dispatch(setBlogLoading(false));
        }
    };

    const handleDeleteBlog = async (blogId: string): Promise<void> => {
        try {
            const { error } = await supabase
                .from('blogs')
                .delete()
                .eq('id', blogId);

            if (error) throw error;
            dispatch(deleteBlog(blogId));
            
            // Calculate based on filtered blogs after deletion
            const remainingBlogs = filteredBlogs.filter(blog => blog.id !== blogId).length;
            const newTotalPages = Math.ceil(remainingBlogs / POSTS_PER_PAGE);
            
            // If current page exceeds new total pages, go to last page
            if (currentPage > newTotalPages && newTotalPages > 0) {
                dispatch(setCurrentPage(newTotalPages));
            }
            // If on page 1 and no blogs left, stay on page 1
            else if (remainingBlogs === 0) {
                dispatch(setCurrentPage(1));
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to delete blog';
            dispatch(setBlogError(errorMessage));
        }
    };

    // Filter and paginate blogs
    const categories = Array.from(new Set(blogs.map((blog: Blog) => blog.category)));
    
    const filteredBlogs = blogs.filter((blog: Blog) => {
        const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            blog.content.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || blog.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const totalPages = Math.ceil(filteredBlogs.length / POSTS_PER_PAGE);

    const paginatedBlogs = filteredBlogs.slice(
        (currentPage - 1) * POSTS_PER_PAGE,
        currentPage * POSTS_PER_PAGE
    );

    useEffect(() => {
        if (user) {
            fetchBlogs();
        }
    }, [user]);

    // All Funtions for Comment Operations would go here
    const fetchComments = async (postId: string): Promise<void> => {
        try {
            const { data, error } = await supabase
                .from('comments')
                .select('*')
                .eq('post_id', postId)
                .order('created_at', { ascending: false });

            if (error) throw error;

            const formattedComments: Comment[] = (data || []).map(comment => ({
                ...comment,
                date: new Date(comment.created_at),
            }));

            dispatch(setComments(formattedComments));
        } catch (err) {
            console.error('Failed to fetch comments:', err);
        }
    };

    const handleAddComment = async (postId: string, content: string, image?: string | null): Promise<void> => {
        try {
        const { data, error } = await supabase
            .from('comments')
            .insert([
            {
                user_id: user?.id,
                post_id: postId,
                content: content,
                image: image || null,
                author: user?.user_metadata.name,
                date: new Date(),
            },
            ])
            .select()
            .single();

            if (error) throw error;

            const formattedComment: Comment = {
                    ...data,
                    date: new Date(data.created_at),
            };

            dispatch(addComment(formattedComment));
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to add comment';
            dispatch(setBlogError(errorMessage));
        }
    };

    const handleEditComment = async (commentId: string, content: string, image?: string | null): Promise<void> => {
        try {
            const { data, error } = await supabase
            .from('comments')
            .update({
                user_id: user?.id,
                post_id: selectedBlog?.id,
                content,
                image: image || null,
            })
            .eq('id', commentId)
            .select()
            .single();

            if (error) throw error;

            const formattedComment: Comment = {
                ...data,
                date: new Date(data.created_at),
            };

            dispatch(updateComment(formattedComment)); 
            
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update comment';
            dispatch(setBlogError(errorMessage));
        }
    };

    const handleDeleteComment = async (commentId: string): Promise<void> => {
        try {
            const { error } = await supabase
                .from('comments')
                .delete()
                .eq('id', commentId);

            if (error) throw error;

            dispatch(deleteComment(commentId));
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to delete comment';
            dispatch(setBlogError(errorMessage));
        }
    };

    useEffect(() => {
        if (selectedBlog) {
            fetchComments(selectedBlog.id);
        }
    }, [selectedBlog]);

    const handleLogout = async (): Promise<void> => {
        try {
            await supabase.auth.signOut();
            dispatch(logout());
            //dispatch(clearBlogs());
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Logout failed';
            dispatch(setError(errorMessage));
        }
    };

    // Render different views based on state
    if (view === 'create') {
        return (
            <>
                <CreateBlogForm onSubmit={handleCreateBlog} onCancel={() => setView('list')}  />;
                <Toaster />
            </>
        )
            
    }

    if (view === 'edit' && editingBlog) {
        // Automatically be deleted in the input box if this is the image URL
        let defaultImgURL = "https://www.brightvessel.com/wp-content/uploads/2024/03/how-to-set-default-blog-page.jpg";

        return (
            <>
                <CreateBlogForm
                    onSubmit={handleUpdateBlog}
                    onCancel={() => {
                        setEditingBlog(null);
                        setView('list');
                    }}
                        initialData={{
                        title: editingBlog.title,
                        excerpt: editingBlog.excerpt,
                        content: editingBlog.content,
                        category: editingBlog.category,
                        tags: editingBlog.tags,
                        image: editingBlog.image === defaultImgURL ? '' : editingBlog.image,
                    }}
                    isEdit
                />
                <Toaster />
            </>
            
        );
    }

    if (view === 'detail' && selectedBlog) {
        return (
            <>
                <div className="min-h-screen bg-background">
                    <div className="container mx-auto px-4 py-8">
                        <BlogPost 
                            post={{
                                id: selectedBlog.id,
                                title: selectedBlog.title,
                                excerpt: selectedBlog.excerpt,
                                content: selectedBlog.content,
                                author: selectedBlog.author,
                                author_id: selectedBlog.author_id,
                                date: selectedBlog.date,
                                category: selectedBlog.category,
                                image: selectedBlog.image,
                                tags: selectedBlog.tags,
                            }}
                            onBack={() => {
                                dispatch(setSelectedBlog(null));
                                setView('list');
                            }}
                        />

                        <CommentSection
                            postId={selectedBlog.id}
                            comments={comments.map(c => ({
                                id: c.id,
                                user_id: c.user_id,
                                post_id: c.post_id,
                                author: c.author,
                                content: c.content,
                                image: c.image,
                                date: c.date,
                            }))}
                            currentUserId={user?.id}
                            onAddComment={(content, image) => handleAddComment(selectedBlog.id, content, image)}
                            onEditComment={handleEditComment}
                            onDeleteComment={handleDeleteComment}
                        />
                    </div>
                </div>
                <Toaster />
            </>
        );
    }


    /* Blog list view would go here */
    return (
        <div className="min-h-screen bg-background">
            <BlogHeader
                searchQuery={searchQuery}
                onSearchChange={(query) => dispatch(setSearchQuery(query))}
                onWriteClick={() => setView('create')}
                user={user ? { name: user.email?.split('@')[0] || 'User', email: user.email || '' } : null}
                onLogout={handleLogout}
            />

            <div className="container mx-auto px-4 py-8" >
                <div className="mb-6">
                    <CategoryFilter
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onCategoryChange={(category) => dispatch(setSelectedCategory(category))}
                    />
                </div>
                

                {blogLoading && (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading blogs...</p>
                    </div>
                )}

                {!blogLoading && filteredBlogs.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-xl text-gray-600 mb-2">No blogs found</p>
                        <p className="text-gray-500">
                        {searchQuery || selectedCategory !== 'All' 
                            ? 'Try adjusting your filters' 
                            : 'Create your first blog to get started!'}
                        </p>
                    </div>
                )}
            </div>

            <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedBlogs.map((blog) => (
                        <BlogCard
                            key={blog.id}
                            post={{
                                id: blog.id,
                                title: blog.title,
                                excerpt: blog.excerpt,
                                content: blog.content,
                                author: blog.author,
                                author_id: blog.author_id,
                                date: blog.date,
                                category: blog.category,
                                image: blog.image,
                                tags: blog.tags,
                            }}
                            onClick={() => {
                                dispatch(setSelectedBlog(blog));
                                setView('detail');
                            }}
                            onEdit={blog.author_id === user?.id ? () => {
                                setEditingBlog(blog);
                                setView('edit');
                            } : undefined}
                            onDelete={blog.author_id === user?.id ? () => setBlogToDelete(blog.id) : undefined}
                            canEdit={blog.author_id === user?.id}
                        />
                    ))}
                </div>

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => dispatch(setCurrentPage(page))}
                />
            </>
           
            <DeleteConfirmDialog
                open={!!blogToDelete}
                onOpenChange={(open) => !open && setBlogToDelete(null)}
                onConfirm={() => blogToDelete && handleDeleteBlog(blogToDelete)}
            />

            <Toaster />
        </div>
    );
}
import { ADMIN_BASE_URL } from 'src/utils/BaseUrls';

export const AUTH_ENDPOINTS = {
  SignIn: `${ADMIN_BASE_URL}/send-login-otp `,
  CheckToken: `${ADMIN_BASE_URL}/dashboard`,
  ValidateOtp: `${ADMIN_BASE_URL}/validate-otp`,
  ResendOtp: `${ADMIN_BASE_URL}/resend-otp`,
};

export const ADMIN_ENDPOINTS = {
  CreateProduct: `${ADMIN_BASE_URL}/products `,
  GetAllProduct: `${ADMIN_BASE_URL}/get-all-products`,
  GetProductById: `${ADMIN_BASE_URL}/get-product-by-id`,
  UpdateProduct: `${ADMIN_BASE_URL}/update-product`,
  DeleteProduct: `${ADMIN_BASE_URL}/delete-product`,
};

export const BLOG_ENDPOINT = {
  CreateBlogPost: `${ADMIN_BASE_URL}/create-blog-post`,
  GetAllBLogList: `${ADMIN_BASE_URL}/get-all-blog-post`,
  GetBlogPostById: `${ADMIN_BASE_URL}/get-blog-post-by-id`,
  UpdateBlogPost: `${ADMIN_BASE_URL}/update-blog-post`,
  DeleteBlogPost: `${ADMIN_BASE_URL}/delete-single-blog-post`,
};

export const CROUSEL_ENDPOINTS = {
  GetAllCrouselList: `${ADMIN_BASE_URL}/get-all-carousel`,
  CreateCrousel: `${ADMIN_BASE_URL}/create-carousel`,
  UpdateCrousel: `${ADMIN_BASE_URL}/update-crousel`,
  DeleteCrousel: `${ADMIN_BASE_URL}/delete-crousel`,
};

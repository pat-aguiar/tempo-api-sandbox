export interface SavedComponent {
  id: string;
  created_at: string;
  name: string;
  component_code: string;
  image_url: string;
  openapi_spec?: any | null;
  user_id: string;
}
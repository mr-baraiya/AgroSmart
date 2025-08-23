namespace AgroSmartBeackend.Helper
{
    public static class ImageHelper
    {
        public static string directory = "Images";
        public static string SaveImageToFile(IFormFile imageFile)
        {
            if (imageFile == null || imageFile.Length == 0)
                return null;
            if (!Directory.Exists($"wwwroot/{directory}"))
            {
                Directory.CreateDirectory($"wwwroot/{directory}");
            }

            string fullPath = $"{directory}/{Guid.NewGuid()}{Path.GetExtension(imageFile.FileName)}";

            using (var stream = new FileStream($"wwwroot/{fullPath}", FileMode.Create))
            {
                imageFile.CopyTo(stream);
            }

            return fullPath;
        }

        public static string DeleteFile(string filePath)
        {
            var path = $"{Directory.GetCurrentDirectory()}/wwwroot/{filePath}";

            if (!System.IO.File.Exists(path)) return "File not found.";

            try
            {
                System.IO.File.Delete(path);
                return "File deleted successfully.";
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}

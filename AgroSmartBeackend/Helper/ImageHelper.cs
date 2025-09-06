namespace AgroSmartBeackend.Helper
{
    public static class ImageHelper
    {
        private static readonly string directory = "Images";  // public URL folder
        private static readonly string rootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");

        public static string SaveImageToFile(IFormFile imageFile)
        {
            if (imageFile == null || imageFile.Length == 0)
                return null;

            string folderPath = Path.Combine(rootPath, directory);
            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }

            string fileName = $"{Guid.NewGuid()}{Path.GetExtension(imageFile.FileName)}";
            string filePath = Path.Combine(folderPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                imageFile.CopyTo(stream);
            }

            // return relative path to save in DB
            return $"{directory}/{fileName}";
        }

        public static string DeleteFile(string filePath)
        {
            var fullPath = Path.Combine(rootPath, filePath);

            if (!System.IO.File.Exists(fullPath))
                return "File not found.";

            try
            {
                System.IO.File.Delete(fullPath);
                return "File deleted successfully.";
            }
            catch
            {
                throw;
            }
        }
    }
}

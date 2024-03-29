﻿namespace Application.DTOs
{
    public class PostPetsDTO
    {
        
        public PostPetsDTO()
        {

        }

        public PostPetsDTO(int id, string name, string address, int zipcode, string city, string? email, string dogBreeds, int price, string description,string image)
        {
            Id = id;
            Name = name;
            Address = address;
            Zipcode = zipcode;
            City = city;
            Email = email;
            DogBreeds = dogBreeds;
            Price = price;
            Description = description;
            Image = image;
        }
        public PostPetsDTO(string name, string address, int zipcode, string city, string? email, string dogBreeds, int price, string description,string image)
        {
            Name = name;
            Address = address;
            Zipcode = zipcode;
            City = city;
            Email = email;
            DogBreeds = dogBreeds;
            Price = price;
            Description = description;
            Image = image;
        }
        public int Id { get; set; }
        public string? Name { get; set; }
        public int Price { get; set; }
        public string Description { get; set; }
        public string DogBreeds { get; set; }
        public string? Address { get; set; }
        public int Zipcode { get; set; }
        public string? City { get; set; }
        public string? Email { get; set; }
        public string? Image { get; set; }
    }


    public class PartialUpdatePetsDTO
    {
        public int? Price { get; set; }
        public string? Name { get; set; }
        public string? Image { get; set; }
        public string? DogBreeds { get; set; }
        public string? Description { get; set; }
        public int Id { get; set; }
    }
}
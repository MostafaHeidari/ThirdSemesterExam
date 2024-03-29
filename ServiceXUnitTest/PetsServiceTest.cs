using Application.Interfaces;
using Domain;
using Moq;
using Application;
using Application.Validators;
using Application.DTOs;
using AutoMapper;
 

namespace XUnitTest
{
    public class PetsServiceTest
    {
        private List<Pets> fakeRepo = new List<Pets>();
        private Mock<IPetsRepository> petsRepoMock = new Mock<IPetsRepository>();

        public PetsServiceTest()
        {
            petsRepoMock.Setup(x => x.GetAllPets()).Returns(fakeRepo);
            petsRepoMock.Setup(x => x.GetPetsById(It.IsAny<int>())).Returns<int>(id => fakeRepo.FirstOrDefault(x => x.Id == id));
            petsRepoMock.Setup(x => x.AddPets(It.IsAny<Pets>())).Callback<Pets>(p => fakeRepo.Add(p));
            petsRepoMock.Setup(x => x.UpdatePets(It.IsAny<Pets>())).Callback<Pets>(p =>
            {
                var index = fakeRepo.IndexOf(p);
                if (index != -1)
                    fakeRepo[index] = p;
            });
        }

        #region Create PetsService
        [Fact]
        public void CreatePetsService_ValidPetsService_Test()
        {
            // Arrange
            Mock<IPetsRepository> repoMock = new Mock<IPetsRepository>();

            PetsService? service = null;

            // Act
            service = new PetsService(repoMock.Object);

            // Assert
            Assert.NotNull(service);
            Assert.True(service is PetsService);
        }

        [Fact]
        public void CreatePetsService_NullRepository_ExpectArgumentExceptionTest()
        {
            // Arrange
            PetsService? service;

            // Act + Assert
            var ex = Assert.Throws<ArgumentException>(() => service = new PetsService(null));
            Assert.Equal("Missing PetsRepository", ex.Message);
        }
        #endregion
        #region AddPets
        [Theory]
        [InlineData(1, "Name", "Address", 1234, "City", "Email", "DogBreeds", 123, "Description", "image")]
        [InlineData(2, "Name", "Address", 1234, "City", null, "DogBreeds", 123, "Description", "image")]
        public void AddPets_ValidPets_Test(int id, string name, string address, int zipcode, string city, string email, string dogBreeds, int price, string description, string image)
        {
            // Arrange
            PostPetsDTO postPets = new PostPetsDTO(name, address, zipcode, city, email, dogBreeds, price, description, image);
            Pets pets = new Pets(id, name, address, zipcode, city, email, dogBreeds, price, description);

            var mapper = new MapperConfiguration(configuration =>
            {
                configuration.CreateMap<PostPetsDTO, Pets>();
            }).CreateMapper();
            var service = new PetsService(petsRepoMock.Object, new PostPetsValidator(), new PetsValidator(), mapper);

            // Act
            service.AddPets(postPets);

            // Assert
            Assert.True(fakeRepo.Count == 1);
            Assert.Equal(pets.Name, fakeRepo[0].Name);
            Assert.Equal(pets.Price, fakeRepo[0].Price);
            Assert.Equal(pets.Address, fakeRepo[0].Address);
            Assert.Equal(pets.Zipcode, fakeRepo[0].Zipcode);
            Assert.Equal(pets.Email, fakeRepo[0].Email);
            Assert.Equal(pets.DogBreeds, fakeRepo[0].DogBreeds);
            //petsRepoMock.Verify(r => r.AddPets(pets), Times.Once);
        }

        [Fact]
        public void AddPets_PetsIsNull_ExpectArgumentException_Test()
        {
            // Arrange
            var mapper = new MapperConfiguration(configuration =>
            {
                configuration.CreateMap<PostPetsDTO, Pets>();
            }).CreateMapper();
            var service = new PetsService(petsRepoMock.Object, new PostPetsValidator(), new PetsValidator(), mapper);
            //var service = new PetsService(petsRepoMock.Object, new PostPetsValidator(), new IValidator<PostPetsDTO>(), mapper); alex ændring

            // Act + Assert
            var ex = Assert.Throws<ArgumentException>(() => service.AddPets(null)); // Kig i interface??
            Assert.Equal("Pets is missing", ex.Message);
            petsRepoMock.Verify(r => r.AddPets(null), Times.Never);
        }
    
        [Fact]
        public void AddPets_DuplicatedId_ExpectArgumentException_Test()
        {
            // Arrange
            PostPetsDTO postPets = new PostPetsDTO(1, "name", "address", 1234, "city", "email", "dogbreed", 123, "description","image");

            var existingPets = new Pets(1, "name", "address", 1234, "city", "email", "dogbreed", 123, "description");
            petsRepoMock.Setup(r => r.GetPetsById(1)).Returns(() => existingPets);
            var mapper = new MapperConfiguration(configuration =>
            {
                configuration.CreateMap<PostPetsDTO, Pets>();
            }).CreateMapper();
            var service = new PetsService(petsRepoMock.Object, new PostPetsValidator(), new PetsValidator(), mapper);

            // Act + assert
            var ex = Assert.Throws<ArgumentException>(() => service.AddPets(postPets));
            Assert.Equal("Pets already exist", ex.Message);
            petsRepoMock.Verify(r => r.AddPets(existingPets), Times.Never);
        }

        #endregion // AddPets



        #region RemovePets

        [Fact]
        public void RemovePets_ValidPets_Test()
        {
            // Arrange
            var p1 = new Pets(1, "name1", "address1", 1234, "city1", "email1", "dogbreed1", 123, "description1");
            var p2 = new Pets(2, "name2", "address2", 2345, "city2", "email2", "dogbreed2", 234, "description2");

            var fakeRepo = new Dictionary<int, Pets>();
            fakeRepo.Add(p1.Id, p1);
            fakeRepo.Add(p2.Id, p2);

            Mock<IPetsRepository> repoMock = new Mock<IPetsRepository>();
            repoMock.Setup(r => r.DeletePets(It.IsAny<int>())).Callback<int>(id => fakeRepo.Remove(id));
            repoMock.Setup(r => r.GetPetsById(It.IsAny<int>())).Returns<int>(id => fakeRepo[id]);


            var service = new PetsService(repoMock.Object);

            // Act
            service.DeletePets(p1.Id);

            // Assert
            Assert.True(fakeRepo.Count == 1);
            Assert.Contains(p2, fakeRepo.Values);
            Assert.DoesNotContain(p1, fakeRepo.Values);
            repoMock.Verify(r => r.DeletePets(p1.Id), Times.Once);
        }
       

        [Fact]
        public void RemovePets_PetsDoesNotExist_ExpectArgumentException()
        {
            // Arrange
            var p1 = new Pets(1, "name1", "address1", 1234, "city1", "email1", "dogbreed1", 123, "description1");
            var p2 = new Pets(2, "name2", "address2", 2345, "city2", "email2", "dogbreed2", 234, "description2");

            var fakeRepo = new Dictionary<int, Pets>();
            fakeRepo.Add(p1.Id, p1);
            fakeRepo.Add(p2.Id, p2);

            Mock<IPetsRepository> repoMock = new Mock<IPetsRepository>();
            repoMock.Setup(r => r.DeletePets(It.IsAny<int>())).Callback<int>(p =>
            {
                fakeRepo.Remove(p);
            });

            var service = new PetsService(repoMock.Object);

            // Act + assert
            var ex = Assert.Throws<ArgumentException>(() => service.DeletePets(p2.Id));
            Assert.Equal("Pets does not exist", ex.Message);
            Assert.Contains(p1, fakeRepo.Values);
            repoMock.Verify(r => r.DeletePets(p2.Id), Times.Never);
        }

        #endregion // RemovePets

    }
}
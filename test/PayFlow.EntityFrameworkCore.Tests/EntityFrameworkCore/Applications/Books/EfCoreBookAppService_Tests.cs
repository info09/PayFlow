using PayFlow.Authors;
using PayFlow.Books;
using Shouldly;
using System;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;
using Xunit;

namespace PayFlow.EntityFrameworkCore.Applications.Books;

[Collection(PayFlowTestConsts.CollectionDefinitionName)]
public class EfCoreBookAppService_Tests : BookAppService_Tests<PayFlowEntityFrameworkCoreTestModule>
{
    [Fact]
    public async Task Should_Create_A_Valid_Book()
    {
        // Arrange
        var authorRepository = GetRequiredService<IRepository<Author, Guid>>();
        var bookRepository = GetRequiredService<IRepository<Book, Guid>>();
        var bookAppService = GetRequiredService<IBookAppService>();

        var author = await authorRepository.InsertAsync(new Author
        {
            Name = "Test Author",
            BirthDate = new DateTime(1990, 1, 1)
        });

        var input = new CreateUpdateBookDto
        {
            Name = "Test Book",
            AuthorId = author.Id,
            Type = BookType.Adventure,
            PublishDate = DateTime.UtcNow,
            Price = 19.99f
        };

        // Act
        var bookDto = await bookAppService.CreateAsync(input);

        // Assert
        bookDto.ShouldNotBeNull();
        bookDto.Name.ShouldBe("Test Book");
        bookDto.AuthorId.ShouldBe(author.Id);
        bookDto.Type.ShouldBe(BookType.Adventure);
    }

    [Fact]
    public async Task Should_Get_Book_By_Id()
    {
        // Arrange
        var authorRepository = GetRequiredService<IRepository<Author, Guid>>();
        var bookRepository = GetRequiredService<IRepository<Book, Guid>>();
        var bookAppService = GetRequiredService<IBookAppService>();

        var author = await authorRepository.InsertAsync(new Author
        {
            Name = "Test Author",
            BirthDate = new DateTime(1990, 1, 1)
        });

        var book = await bookRepository.InsertAsync(new Book
        {
            Name = "Test Book",
            AuthorId = author.Id,
            Type = BookType.Adventure,
            PublishDate = DateTime.UtcNow,
            Price = 19.99f
        });

        // Act
        var bookDto = await bookAppService.GetAsync(book.Id);

        // Assert
        bookDto.ShouldNotBeNull();
        bookDto.Id.ShouldBe(book.Id);
        bookDto.Name.ShouldBe("Test Book");
        bookDto.AuthorName.ShouldBe("Test Author");
    }

    [Fact]
    public async Task Should_Get_Book_List()
    {
        // Arrange
        var authorRepository = GetRequiredService<IRepository<Author, Guid>>();
        var bookRepository = GetRequiredService<IRepository<Book, Guid>>();
        var bookAppService = GetRequiredService<IBookAppService>();

        // Clear existing books to ensure test isolation
        var existingBooks = await bookRepository.GetListAsync();
        foreach (var book in existingBooks)
        {
            await bookRepository.DeleteAsync(book.Id);
        }

        var author = await authorRepository.InsertAsync(new Author
        {
            Name = "Test Author",
            BirthDate = new DateTime(1990, 1, 1)
        });

        await bookRepository.InsertAsync(new Book
        {
            Name = "Book 1",
            AuthorId = author.Id,
            Type = BookType.Adventure,
            PublishDate = DateTime.UtcNow,
            Price = 19.99f
        });

        await bookRepository.InsertAsync(new Book
        {
            Name = "Book 2",
            AuthorId = author.Id,
            Type = BookType.ScienceFiction,
            PublishDate = DateTime.UtcNow,
            Price = 29.99f
        });

        // Act
        var bookList = await bookAppService.GetListAsync(new PagedAndSortedResultRequestDto());

        // Assert
        bookList.Items.ShouldNotBeEmpty();
        bookList.TotalCount.ShouldBe(2);
        bookList.Items.Count.ShouldBe(2);
    }

    [Fact]
    public async Task Should_Update_Book()
    {
        // Arrange
        var authorRepository = GetRequiredService<IRepository<Author, Guid>>();
        var bookRepository = GetRequiredService<IRepository<Book, Guid>>();
        var bookAppService = GetRequiredService<IBookAppService>();

        var author = await authorRepository.InsertAsync(new Author
        {
            Name = "Test Author",
            BirthDate = new DateTime(1990, 1, 1)
        });

        var book = await bookRepository.InsertAsync(new Book
        {
            Name = "Test Book",
            AuthorId = author.Id,
            Type = BookType.Adventure,
            PublishDate = DateTime.UtcNow,
            Price = 19.99f
        });

        var input = new CreateUpdateBookDto
        {
            Name = "Updated Book",
            AuthorId = author.Id,
            Type = BookType.Biography,
            PublishDate = DateTime.UtcNow,
            Price = 29.99f
        };

        // Act
        var updatedBookDto = await bookAppService.UpdateAsync(book.Id, input);

        // Assert
        updatedBookDto.ShouldNotBeNull();
        updatedBookDto.Name.ShouldBe("Updated Book");
        updatedBookDto.Type.ShouldBe(BookType.Biography);
        updatedBookDto.Price.ShouldBe(29.99f);
    }

    [Fact]
    public async Task Should_Delete_Book()
    {
        // Arrange
        var authorRepository = GetRequiredService<IRepository<Author, Guid>>();
        var bookRepository = GetRequiredService<IRepository<Book, Guid>>();
        var bookAppService = GetRequiredService<IBookAppService>();

        var author = await authorRepository.InsertAsync(new Author
        {
            Name = "Test Author",
            BirthDate = new DateTime(1990, 1, 1)
        });

        var book = await bookRepository.InsertAsync(new Book
        {
            Name = "Test Book",
            AuthorId = author.Id,
            Type = BookType.Adventure,
            PublishDate = DateTime.UtcNow,
            Price = 19.99f
        });

        // Act
        await bookAppService.DeleteAsync(book.Id);

        // Assert
        var deletedBook = await bookRepository.FindAsync(book.Id);
        deletedBook.ShouldBeNull();
    }
}

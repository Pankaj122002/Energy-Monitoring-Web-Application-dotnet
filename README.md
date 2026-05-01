# Energy Monitoring Web Application (.NET)

A real-time energy monitoring web application that collects, processes, and visualizes live data from multiple IoT-enabled energy meters. The application features a robust .NET backend API with SQL Server database integration and a dynamic JavaScript frontend for interactive data visualization.

## Overview

This project demonstrates a complete end-to-end solution for monitoring energy consumption across multiple sources. It integrates IoT devices, cloud processing, and real-time visualization to provide insights into energy usage patterns.

## Key Features

- **Real-time Data Collection** - Continuous data intake from IoT-enabled energy meters
- **Live Visualization** - Dynamic JavaScript frontend for real-time energy data visualization
- **Robust Backend** - .NET 8.0 APIs for data processing and business logic
- **SQL Server Integration** - Persistent data storage and management with Entity Framework Core
- **JWT Authentication** - Secure API endpoints with token-based authentication
- **Swagger Documentation** - Interactive API documentation via Swashbuckle
- **Logging & Monitoring** - Comprehensive logging with NLog
- **Scalable Architecture** - Designed to handle multiple concurrent data streams
- **API Simulator** - Built-in simulator for testing and development without live IoT devices
- **Scheduled Tasks** - Automated processing and reporting capabilities
- **Report Generation** - PDF and Excel report generation capabilities


## Tech Stack

### Backend
- **.NET 8.0** - Modern application framework
- **C#** - Primary programming language
- **ASP.NET Core** - Web application framework
- **Entity Framework Core 8.0.1** - Object-relational mapping (ORM)
- **SQL Server** - Database management system with SqlClient
- **JWT (JSON Web Tokens)** - Authentication and authorization
- **Swagger/Swashbuckle** - API documentation and testing

### Frontend
- **JavaScript** - Client-side scripting
- **HTML/CSS** - UI markup and styling
- **Bootstrap/Custom CSS** - Responsive design

### Libraries & Tools
- **NLog.Web.AspNetCore** - Structured logging
- **Newtonsoft.Json** - JSON serialization
- **EPPlus.Core** - Excel file generation
- **DocumentFormat.OpenXml** - Office Open XML handling
- **iTextSharp** - PDF generation
- **Select.HtmlToPdf** - HTML to PDF conversion

## Architecture Layers

### 1. **Web UI Layer** (`ComplaintMGT`)
- ASP.NET Core MVC application
- Razor views and layouts
- Static assets (CSS, JavaScript, images)
- Features: Thermal monitoring, HVAC controls, MapView
- Dependencies: Core, Abstractions

### 2. **API Layer** (`ComplaintMGT.API`)
- RESTful Web API endpoints
- JWT-based authentication
- Swagger documentation (OpenAPI)
- Logging integration
- Dependencies: Core, Bootstrapper, Scheduler, Abstractions

### 3. **Business Logic Layer** (`ComplaintMTG.Core`)
- Service implementations
- Domain models and business rules
- Report generation (PDF, Excel)
- Data transformation and processing
- Dependencies: Infrastructure, Abstractions

### 4. **Data Access Layer** (`ComplaintMGT.Infrastructure`)
- Entity Framework Core DbContext
- Repository pattern implementation
- SQL Server integration
- Database operations and queries
- Dependencies: Abstractions

### 5. **Abstractions Layer** (`ComplaintMGT.Abstractions`)
- Interface contracts (IService, IRepository)
- DTO definitions
- Service abstractions
- No external dependencies

### 6. **Configuration Layer** (`ComplaintMGT.Bootstrapper`)
- Dependency injection setup
- Service registration
- Configuration initialization

### 7. **Simulator** (`ComplaintMGT.APISimulator`)
- Mock API for testing
- Simulates IoT meter data
- Development and testing support

### 8. **Background Jobs** (`CompliantMGT.Scheduler`)
- Scheduled task execution
- Automated reporting
- Data processing jobs

## Technology Details

### Framework & Platform
- **Target Framework**: .NET 8.0
- **Language**: C# with implicit usings and nullable reference types enabled

### Database
- **Provider**: SQL Server (EF Core SqlServer)
- **ORM**: Entity Framework Core 8.0.1
- **Features**: Relational queries, migrations, change tracking

### Authentication & Authorization
- **JWT Bearer** Authentication
- **Microsoft.AspNetCore.Authentication.JwtBearer** 8.0.1
- **System.IdentityModel.Tokens.Jwt** 7.2.0

### API & Serialization
- **Swagger/Swashbuckle** 6.5.0 for API documentation
- **Newtonsoft.Json** 13.0.3 for JSON handling
- **MVC Formatters** for content negotiation

### Reporting & Export
- **EPPlus.Core** 1.5.4 - Excel generation
- **DocumentFormat.OpenXml** 3.0.1 - Office documents
- **iTextSharp** 5.5.13.3 - PDF creation
- **Select.HtmlToPdf** 23.2.0 - HTML to PDF conversion

### Logging & Monitoring
- **NLog.Web.AspNetCore** 5.3.8 - Structured logging framework

## Getting Started

### Prerequisites
- **.NET 8.0 SDK** or higher
- **Visual Studio 2022** (latest) or **Visual Studio Code**
- **SQL Server 2019** or higher
- **SQL Server Management Studio** (optional, for database management)
- **Git** for version control




USE [pe_db_complaintMGT]
GO
/****** Object:  Table [dbo].[tbl_MeterBrandMaster]    Script Date: 11/25/2025 9:41:44 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tbl_MeterBrandMaster](
	[MeterBrandID] [int] NOT NULL,
	[MeterBrand] [varchar](50) NULL,
	[CreateDate] [datetime] NULL,
	[UpdateDate] [datetime] NULL,
	[CreateBy] [varchar](50) NULL,
	[UpdateBy] [varchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[MeterBrandID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
INSERT [dbo].[tbl_MeterBrandMaster] ([MeterBrandID], [MeterBrand], [CreateDate], [UpdateDate], [CreateBy], [UpdateBy]) VALUES (1, N'ElMeasure', CAST(N'2025-10-01T09:10:00.000' AS DateTime), NULL, N'adminhk', NULL)
GO

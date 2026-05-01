USE [pe_db_complaintMGT]
GO
/****** Object:  Table [dbo].[tbl_MeterModelMaster]    Script Date: 11/25/2025 9:41:44 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tbl_MeterModelMaster](
	[MeterModelID] [int] NOT NULL,
	[MeterModel] [varchar](50) NULL,
	[MeterBrandID] [int] NULL,
	[CreateDate] [datetime] NULL,
	[UpdateDate] [datetime] NULL,
	[CreateBy] [varchar](50) NULL,
	[UpdateBy] [varchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[MeterModelID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
INSERT [dbo].[tbl_MeterModelMaster] ([MeterModelID], [MeterModel], [MeterBrandID], [CreateDate], [UpdateDate], [CreateBy], [UpdateBy]) VALUES (1, N'LG6435', 1, CAST(N'2025-10-01T09:00:00.000' AS DateTime), NULL, N'adminhk', NULL)
INSERT [dbo].[tbl_MeterModelMaster] ([MeterModelID], [MeterModel], [MeterBrandID], [CreateDate], [UpdateDate], [CreateBy], [UpdateBy]) VALUES (2, N'LG2510D', 1, CAST(N'2025-10-01T09:00:00.000' AS DateTime), NULL, N'adminhk', NULL)
GO
ALTER TABLE [dbo].[tbl_MeterModelMaster]  WITH CHECK ADD  CONSTRAINT [FK_tbl_MeterModelMaster_tbl_MeterBrandMaster] FOREIGN KEY([MeterBrandID])
REFERENCES [dbo].[tbl_MeterBrandMaster] ([MeterBrandID])
GO
ALTER TABLE [dbo].[tbl_MeterModelMaster] CHECK CONSTRAINT [FK_tbl_MeterModelMaster_tbl_MeterBrandMaster]
GO

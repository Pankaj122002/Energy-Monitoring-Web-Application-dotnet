USE [pe_db_complaintMGT]
GO
/****** Object:  Table [dbo].[tbl_MeterMaster]    Script Date: 11/25/2025 9:41:44 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tbl_MeterMaster](
	[MeterMasterID] [int] NOT NULL,
	[MeterModel] [varchar](50) NULL,
	[MeterTypeMasterID] [int] NULL,
	[PhaseID] [int] NULL,
	[MeterBrandID] [int] NULL,
	[MeterModelID] [int] NULL,
	[CreateDate] [datetime] NULL,
	[UpdateDate] [datetime] NULL,
	[CreateBy] [varchar](50) NULL,
	[UpdateBy] [varchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[MeterMasterID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
INSERT [dbo].[tbl_MeterMaster] ([MeterMasterID], [MeterModel], [MeterTypeMasterID], [PhaseID], [MeterBrandID], [MeterModelID], [CreateDate], [UpdateDate], [CreateBy], [UpdateBy]) VALUES (1, N'LG6435', 1, 2, 1, 1, CAST(N'2025-10-01T09:00:00.000' AS DateTime), NULL, N'adminhk', NULL)
INSERT [dbo].[tbl_MeterMaster] ([MeterMasterID], [MeterModel], [MeterTypeMasterID], [PhaseID], [MeterBrandID], [MeterModelID], [CreateDate], [UpdateDate], [CreateBy], [UpdateBy]) VALUES (2, N'LG2510D', 2, 2, 1, 2, CAST(N'2025-10-01T09:00:00.000' AS DateTime), NULL, N'adminhk', NULL)
GO
ALTER TABLE [dbo].[tbl_MeterMaster]  WITH CHECK ADD  CONSTRAINT [FK_tbl_MeterBrandMaster_tbl_MeterMaster] FOREIGN KEY([MeterBrandID])
REFERENCES [dbo].[tbl_MeterBrandMaster] ([MeterBrandID])
GO
ALTER TABLE [dbo].[tbl_MeterMaster] CHECK CONSTRAINT [FK_tbl_MeterBrandMaster_tbl_MeterMaster]
GO
ALTER TABLE [dbo].[tbl_MeterMaster]  WITH CHECK ADD  CONSTRAINT [FK_tbl_MeterModelMaster_tbl_MeterMaster] FOREIGN KEY([MeterModelID])
REFERENCES [dbo].[tbl_MeterModelMaster] ([MeterModelID])
GO
ALTER TABLE [dbo].[tbl_MeterMaster] CHECK CONSTRAINT [FK_tbl_MeterModelMaster_tbl_MeterMaster]
GO
ALTER TABLE [dbo].[tbl_MeterMaster]  WITH CHECK ADD  CONSTRAINT [FK_tbl_MeterTypeMaster_tbl_MeterMaster] FOREIGN KEY([MeterTypeMasterID])
REFERENCES [dbo].[tbl_MeterTypeMaster] ([MeterTypeMasterID])
GO
ALTER TABLE [dbo].[tbl_MeterMaster] CHECK CONSTRAINT [FK_tbl_MeterTypeMaster_tbl_MeterMaster]
GO

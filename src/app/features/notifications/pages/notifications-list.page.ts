import { Component, inject, OnInit, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationsStore } from '../state/notifications.store';
import { BroadcastNotificationViewModel } from '../models/notifications-view.model';
import { PageHeaderComponent, BadgeComponent } from '@nukkadnow/admin-ui';
import { DataTableComponent, TableColumn } from '@nukkadnow/admin-data-table';
import { NotificationsStatusChipComponent } from '../components/notifications-status-chip.component';
import { AdminSessionService } from '../../../core/auth/session.service';
import { formatChannelBadge, formatAudienceLabel } from '../utils/notifications.utils';

@Component({
  selector: 'admin-notifications-list-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PageHeaderComponent,
    BadgeComponent,
    DataTableComponent,
    NotificationsStatusChipComponent,
  ],
  templateUrl: './notifications-list.page.html',
  styleUrls: ['./notifications-list.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsListPageComponent implements OnInit {
  readonly store = inject(NotificationsStore);
  readonly sessionService = inject(AdminSessionService);
  private readonly router = inject(Router);

  searchQuery = '';
  selectedCity = 'ALL';
  selectedChannel = 'ALL';
  selectedStatus = 'ALL';

  readonly activeCityName = computed(() => {
    const geo = this.sessionService.geoAssignment();
    if (geo?.cityName) return geo.cityName;
    return this.selectedCity === 'ALL' ? 'Multi-City Network' : this.selectedCity;
  });

  // Compose Broadcast Modal State
  showComposeModal = signal<boolean>(false);
  newCampaignName = '';
  newChannel = 'WHATSAPP';
  newTargetAudience = 'CITY_MERCHANTS';
  newTargetCity = 'Nagpur';
  newTargetLocality = 'ALL';
  newMessageText = '';

  readonly tableColumns: TableColumn<BroadcastNotificationViewModel>[] = [
    { key: 'id', header: 'Campaign ID', width: '130px', sortable: true },
    { key: 'name', header: 'Campaign Name & Author', width: '260px', sortable: true },
    { key: 'channel', header: 'Channel', width: '160px', sortable: true },
    { key: 'targetAudience', header: 'Target Segment & Territory', sortable: true },
    { key: 'recipientCount', header: 'Volume & Deliverability', width: '200px', sortable: true },
    { key: 'status', header: 'Status', width: '130px', sortable: true },
    { key: 'createdAt', header: 'Dispatched At', width: '160px', sortable: true },
  ];

  ngOnInit(): void {
    const geo = this.sessionService.geoAssignment();
    if (geo?.cityName) {
      this.newTargetCity = geo.cityName;
    }
    this.fetchData();
  }

  fetchData(): void {
    const geo = this.sessionService.geoAssignment();
    const city = geo?.cityName || (this.selectedCity !== 'ALL' ? this.selectedCity : undefined);
    this.store.loadItems({
      search: this.searchQuery || undefined,
      city,
      channel: this.selectedChannel !== 'ALL' ? this.selectedChannel : undefined,
      status: this.selectedStatus !== 'ALL' ? this.selectedStatus : undefined,
    });
  }

  onCityFilterChange(city: string): void {
    this.selectedCity = city;
    this.fetchData();
  }

  onChannelFilter(channel: string): void {
    this.selectedChannel = channel;
    this.fetchData();
  }

  onStatusFilter(status: string): void {
    this.selectedStatus = status;
    this.fetchData();
  }

  applySearch(): void {
    this.fetchData();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.fetchData();
  }

  getChannelInfo(channel: string) {
    return formatChannelBadge(channel);
  }

  getAudienceText(item: BroadcastNotificationViewModel) {
    return formatAudienceLabel(item.targetAudience, item.targetCity, item.targetLocality);
  }

  onRowClick(row: BroadcastNotificationViewModel): void {
    this.router.navigate(['/notifications', row.id]);
  }

  openComposeModal(): void {
    this.newCampaignName = '';
    this.newMessageText = '';
    const geo = this.sessionService.geoAssignment();
    this.newTargetCity = geo?.cityName || (this.selectedCity !== 'ALL' ? this.selectedCity : 'Nagpur');
    this.showComposeModal.set(true);
  }

  closeComposeModal(): void {
    this.showComposeModal.set(false);
  }

  insertTag(tag: string): void {
    this.newMessageText += ` ${tag}`;
  }

  sendBroadcast(): void {
    if (!this.newCampaignName.trim() || !this.newMessageText.trim()) return;

    this.store.createItem({
      name: this.newCampaignName.trim(),
      channel: this.newChannel,
      targetAudience: this.newTargetAudience,
      targetCity: this.newTargetCity,
      targetLocality: this.newTargetLocality,
      messageTemplate: this.newMessageText.trim(),
      recipientCount: this.newTargetCity === 'GLOBAL' ? 12500 : 2200,
    }).subscribe(() => {
      this.closeComposeModal();
      this.fetchData();
    });
  }

  exportRecords(): void {
    const items = this.store.items();
    if (!items.length) return;

    const headers = ['CampaignID', 'Name', 'Channel', 'Audience', 'City', 'Locality', 'Recipients', 'DeliveryRate', 'Status', 'DispatchedAt'];
    const rows = items.map(c => [
      c.id,
      `"${c.name.replace(/"/g, '""')}"`,
      c.channel,
      c.targetAudience,
      c.targetCity,
      c.targetLocality,
      c.recipientCount,
      `${c.deliveryRatePercent}%`,
      c.status,
      c.createdAt,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `nukkadnow-broadcast-audit-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

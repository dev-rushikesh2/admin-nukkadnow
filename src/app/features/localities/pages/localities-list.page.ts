import { Component, inject, OnInit, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalitiesStore } from '../state/localities.store';
import { PageHeaderComponent, BadgeComponent } from '@nukkadnow/admin-ui';
import { DataTableComponent, TableColumn } from '@nukkadnow/admin-data-table';
import { LocalityViewModel } from '../models/localities-view.model';
import { LocalitiesStatusChipComponent } from '../components/localities-status-chip.component';
import { AdminSessionService } from '../../../core/auth/session.service';
import { AdminApiClient, AdminEndpoints } from '@nukkadnow/admin-api-client';

@Component({
  selector: 'admin-localities-list-page',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent, BadgeComponent, DataTableComponent, LocalitiesStatusChipComponent],
  templateUrl: './localities-list.page.html',
  styleUrls: ['./localities-list.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocalitiesListPageComponent implements OnInit {
  readonly store = inject(LocalitiesStore);
  private readonly router = inject(Router);
  private readonly apiClient = inject(AdminApiClient);
  readonly sessionService = inject(AdminSessionService);

  readonly activeSubTab = signal<'LOCALITIES' | 'DISTRICTS' | 'STATES' | 'COUNTRIES' | 'GEOJSON_IMPORT'>('LOCALITIES');
  readonly selectedCity = signal<string>('ALL');
  readonly selectedStatus = signal<string>('ALL');
  readonly searchQuery = signal<string>('');
  readonly isAddModalOpen = signal<boolean>(false);
  readonly isSubmitting = signal<boolean>(false);

  // Geographic Hierarchy State
  readonly countriesList = signal<any[]>([]);
  readonly statesList = signal<any[]>([]);
  readonly districtsList = signal<any[]>([]);

  // GeoJSON Import State
  importGeoJsonText = '';
  importCityCode = 'IN-MH-NGP';
  readonly isImporting = signal<boolean>(false);
  readonly importSuccessMessage = signal<string | null>(null);
  readonly importErrorMessage = signal<string | null>(null);

  // New Zone Form Model
  newZone = {
    name: '',
    city: 'Nagpur',
    pincode: '',
    deliveryRadiusKm: 5,
    geofenceType: 'POLYGON' as 'POLYGON' | 'RADIUS_CIRCLE',
    status: 'ACTIVE' as 'ACTIVE' | 'CONGESTED' | 'MAINTENANCE' | 'INACTIVE',
    centerLat: 21.1458,
    centerLng: 79.0882
  };

  readonly filteredLocalities = computed(() => {
    let list = this.store.items();
    const city = this.selectedCity();
    const status = this.selectedStatus();
    const query = this.searchQuery().toLowerCase().trim();

    const geo = this.sessionService.geoAssignment();
    if (geo?.cityName) {
      list = list.filter(l => l.city.toLowerCase() === geo.cityName.toLowerCase());
    } else if (city !== 'ALL') {
      list = list.filter(l => l.city.toLowerCase() === city.toLowerCase());
    }

    if (status !== 'ALL') {
      list = list.filter(l => l.status === status);
    }

    if (query) {
      list = list.filter(l =>
        l.name.toLowerCase().includes(query) ||
        l.pincode.includes(query) ||
        l.city.toLowerCase().includes(query)
      );
    }

    return list;
  });

  // Dynamic Summary Metrics
  readonly totalLocalitiesCount = computed(() => this.filteredLocalities().length);
  readonly activeGeofencesCount = computed(() =>
    this.filteredLocalities().filter(l => l.status === 'ACTIVE').length
  );
  readonly coveredPincodesCount = computed(() => {
    const pins = new Set(this.filteredLocalities().map(l => l.pincode));
    return pins.size;
  });
  readonly avgDeliveryRadius = computed(() => {
    const list = this.filteredLocalities();
    if (list.length === 0) return 0;
    const sum = list.reduce((acc, curr) => acc + (curr.deliveryRadiusKm || 5), 0);
    return (sum / list.length).toFixed(1);
  });

  readonly tableColumns: TableColumn<LocalityViewModel>[] = [
    { key: 'name', header: 'Locality & Zone', sortable: true },
    { key: 'city', header: 'City & Pincode', width: '160px', sortable: true },
    { key: 'activeOutlets', header: 'Active Outlets', width: '130px', align: 'center', sortable: true },
    { key: 'deliveryRadiusKm', header: 'Radius (km)', width: '120px', align: 'center', sortable: true },
    { key: 'geofenceType', header: 'Geofence Type', width: '140px', align: 'center' },
    { key: 'status', header: 'Operating State', width: '160px', sortable: true }
  ];

  ngOnInit(): void {
    const geo = this.sessionService.geoAssignment();
    if (geo?.cityName) {
      this.selectedCity.set(geo.cityName);
      this.newZone.city = geo.cityName;
      this.importCityCode = geo.cityId || 'IN-MH-NGP';
    }
    this.store.loadItems();
    this.loadHierarchyData();
  }

  setSubTab(tab: 'LOCALITIES' | 'DISTRICTS' | 'STATES' | 'COUNTRIES' | 'GEOJSON_IMPORT'): void {
    this.activeSubTab.set(tab);
  }

  loadHierarchyData(): void {
    this.apiClient.get<any>(AdminEndpoints.GEO_COUNTRIES).subscribe({
      next: (res) => this.countriesList.set(res.data?.items || res.data || [])
    });
    this.apiClient.get<any>(AdminEndpoints.GEO_STATES).subscribe({
      next: (res) => this.statesList.set(res.data?.items || res.data || [])
    });
    this.apiClient.get<any>(AdminEndpoints.GEO_DISTRICTS).subscribe({
      next: (res) => this.districtsList.set(res.data?.items || res.data || [])
    });
  }

  submitGeoJsonImport(): void {
    this.importErrorMessage.set(null);
    this.importSuccessMessage.set(null);

    if (!this.importGeoJsonText.trim()) {
      this.importErrorMessage.set('Please paste a valid GeoJSON FeatureCollection string.');
      return;
    }

    let parsed: any;
    try {
      parsed = JSON.parse(this.importGeoJsonText);
    } catch {
      this.importErrorMessage.set('Invalid JSON format. Check syntax and quotation marks.');
      return;
    }

    this.isImporting.set(true);
    this.apiClient.post<any>(AdminEndpoints.GEO_IMPORT_GEOJSON, {
      cityCode: this.importCityCode,
      geoJson: parsed,
    }).subscribe({
      next: (res) => {
        this.isImporting.set(false);
        this.importSuccessMessage.set(`Successfully imported ${res.data?.importedCount || 1} micro-market localities!`);
        this.importGeoJsonText = '';
        this.store.loadItems();
        setTimeout(() => this.setSubTab('LOCALITIES'), 1500);
      },
      error: (err) => {
        this.isImporting.set(false);
        this.importErrorMessage.set(err.message || 'Failed to import GeoJSON features.');
      }
    });
  }

  loadSampleGeoJson(): void {
    this.importGeoJsonText = JSON.stringify({
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {
            name: "Manish Nagar & Besa",
            pincode: "440015",
            deliveryRadiusKm: 6
          },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [79.075, 21.105],
                [79.085, 21.106],
                [79.084, 21.095],
                [79.074, 21.094],
                [79.075, 21.105]
              ]
            ]
          }
        }
      ]
    }, null, 2);
  }

  onCityChange(city: string): void {
    this.selectedCity.set(city);
  }

  onStatusChange(status: string): void {
    this.selectedStatus.set(status);
  }

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  refresh(): void {
    this.store.loadItems();
  }

  openAddModal(): void {
    const geo = this.sessionService.geoAssignment();
    this.newZone = {
      name: '',
      city: geo?.cityName || 'Nagpur',
      pincode: '',
      deliveryRadiusKm: 5,
      geofenceType: 'POLYGON',
      status: 'ACTIVE',
      centerLat: 21.1458,
      centerLng: 79.0882
    };
    this.isAddModalOpen.set(true);
  }

  closeAddModal(): void {
    this.isAddModalOpen.set(false);
  }

  submitNewZone(): void {
    if (!this.newZone.name || !this.newZone.pincode) {
      return;
    }

    this.isSubmitting.set(true);
    this.store.createZone(this.newZone).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.closeAddModal();
      },
      error: () => {
        this.isSubmitting.set(false);
      }
    });
  }

  exportCsv(): void {
    const list = this.filteredLocalities();
    if (list.length === 0) return;

    const headers = ['Locality ID', 'Locality Name', 'City', 'Pincode', 'Active Outlets', 'Delivery Radius (km)', 'Geofence Type', 'Status'];
    const rows = list.map(l => [
      `"${l.id}"`,
      `"${l.name}"`,
      `"${l.city}"`,
      `"${l.pincode}"`,
      l.activeOutlets,
      l.deliveryRadiusKm,
      `"${l.geofenceType}"`,
      `"${l.status}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `nukkadnow-localities-${this.selectedCity().toLowerCase()}-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  onRowClick(row: LocalityViewModel): void {
    this.router.navigate(['/localities', row.id]);
  }
}
